from sqlalchemy.orm import Session
from fastapi import HTTPException
from entities.alunos import Usuario
from entities.agendamentos import Agendamento, MaquinaEnum
from agendamentos.models import AgendamentoCreate
from datetime import datetime, timedelta, timezone

# --- SUAS REGRAS DE AGENDAMENTO (ATUALIZADAS) ---

def get_dias_permitidos(usuario: Usuario):
    """
    Retorna os dias da semana (0=Seg, 1=Ter, etc) E uma descrição textual
    dos dias que o usuário PODE agendar.
    """
    semestre = usuario.semestre

    # REGRA 1: Prioridade Máxima (10º semestre)
    if semestre == 10:
        return [0, 1, 2, 3, 4], "Segunda, Terça, Quarta, Quinta e Sexta"

    # REGRA 2: Alunos de TCC (7º a 9º semestre) com comprovante validado
    if 7 <= semestre <= 9 and usuario.eh_aluno_tcc:
        return [2, 4], "Quarta e Sexta"

    # REGRA 3: Padrão (demais alunos)
    return [0, 1, 4], "Segunda, Terça e Sexta"

# --- FIM DAS REGRAS ---


# --- FUNÇÃO PRINCIPAL ATUALIZADA ---

def service_get_horarios_disponiveis(db: Session, usuario: Usuario, tipo_maquina: MaquinaEnum | None = None):
    """
    Retorna uma estrutura de dados inteligente com os próximos dias 
    e horários vagos, baseado nas regras de permissão do usuário.
    
    Procura vagas nos próximos 14 dias.
    """
    dias_permitidos_cod, dias_permitidos_desc = get_dias_permitidos(usuario)
    
    # Usamos datetime.now(timezone.utc) para garantir que estamos no fuso correto
    hoje = datetime.now(timezone.utc).date()
    
    # Define os horários de funcionamento (ex: 8h às 18h, em UTC)
    # IMPORTANTE: Ajuste estas horas se o seu servidor não estiver em UTC
    horas_funcionamento = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

    # Pega TODOS os agendamentos futuros para checar conflito
    # (Otimização: pegar apenas dos próximos 14 dias)
    limite_futuro = hoje + timedelta(days=14)
    query = db.query(Agendamento).filter(
        Agendamento.data_inicio >= datetime.now(timezone.utc),
        Agendamento.data_inicio < limite_futuro
    )
    # Cada máquina tem sua própria agenda
    if tipo_maquina:
        query = query.filter(Agendamento.tipo_maquina == tipo_maquina)
    agendamentos_futuros = query.all()
    
    # Cria um set de horários ocupados para checagem rápida.
    # O banco devolve datetimes sem fuso (naive); os slots abaixo são em UTC,
    # então normalizamos tudo para UTC antes de comparar.
    slots_ocupados = set()
    for ag in agendamentos_futuros:
        inicio = ag.data_inicio.replace(tzinfo=timezone.utc)
        slots_ocupados.add(inicio)
        # Se durou 2h, o slot seguinte também está ocupado
        if (ag.data_fim - ag.data_inicio).total_seconds() > 3600:
             slots_ocupados.add(inicio + timedelta(hours=1))

    # --- Nova Lógica de Busca ---
    dias_disponiveis_list = [] # Onde vamos salvar os dias que têm vagas
    
    # Procura nos próximos 14 dias (incluindo hoje)
    for dia_offset in range(14):
        dia_atual = hoje + timedelta(days=dia_offset)
        
        # 1. Verifica se o dia da semana está PERMITIDO para este usuário
        if dia_atual.weekday() in dias_permitidos_cod:
            
            horarios_do_dia = [] # Lista de slots vagos para este dia
            
            # 2. Verifica cada hora de funcionamento
            for hora in horas_funcionamento:
                # Cria o slot de início (assumindo UTC)
                slot_inicio = datetime(dia_atual.year, dia_atual.month, dia_atual.day, hora, tzinfo=timezone.utc)
                
                # 3. Verifica se o slot está VAGO
                if slot_inicio not in slots_ocupados:
                    # Slot de 1h está vago. E o de 2h?
                    slot_proxima_hora = slot_inicio + timedelta(hours=1)
                    pode_2h = (slot_proxima_hora not in slots_ocupados) and (slot_proxima_hora.hour in horas_funcionamento)

                    horarios_do_dia.append({
                        "slot_inicio_iso": slot_inicio.isoformat(), # O frontend usará isso para agendar
                        "hora_display": f"{hora:02d}:00", # O frontend usará isso para mostrar
                        "duracao_2h_disponivel": pode_2h
                    })
            
            # 4. Se este dia teve pelo menos 1 horário vago, adiciona ele à lista
            if horarios_do_dia:
                dias_disponiveis_list.append({
                    "data": dia_atual.isoformat(), # Data para o frontend (ex: "2025-11-17")
                    "horarios_livres": horarios_do_dia
                })

    # 5. Retorna o novo objeto estruturado
    return {
        "regras_agendamento": {
            "dias_permitidos_cod": dias_permitidos_cod,
            "dias_permitidos_desc": dias_permitidos_desc
        },
        "dias_disponiveis": dias_disponiveis_list
    }

# --- O RESTO DO SEU ARQUIVO (service_criar_agendamento, etc) ---
# --- NÃO PRECISA DE NENHUMA MUDANÇA ---

def service_criar_agendamento(db: Session, usuario: Usuario, ag_data: AgendamentoCreate):
    # 1. Valida a duração (1 ou 2 horas)
    if ag_data.duracao_horas not in (1, 2):
        raise HTTPException(status_code=400, detail="Duração deve ser 1 ou 2 horas")

    # O frontend deve enviar a data_inicio em formato ISO (que já vem do endpoint de horários)
    data_inicio = ag_data.data_inicio
    data_fim = data_inicio + timedelta(hours=ag_data.duracao_horas)

    # 2. Verifica se o dia da semana é permitido para o usuário
    dias_permitidos, _ = get_dias_permitidos(usuario) # Ignora a descrição
    if data_inicio.weekday() not in dias_permitidos:
        raise HTTPException(status_code=403, detail="Você não tem permissão para agendar neste dia da semana.")

    # 3. Verifica conflito de horário (Checagem final)
    conflito = db.query(Agendamento).filter(
        (Agendamento.tipo_maquina == ag_data.tipo_maquina) &
        (Agendamento.data_inicio < data_fim) & (Agendamento.data_fim > data_inicio)
    ).first()

    if conflito:
        raise HTTPException(status_code=409, detail="Horário indisponível. Outro usuário já agendou.")

    # 4. Cria o agendamento
    novo_agendamento = Agendamento(
        usuario_id=usuario.id,
        tipo_maquina=ag_data.tipo_maquina,
        data_inicio=data_inicio,
        data_fim=data_fim
    )
    db.add(novo_agendamento)
    db.commit()
    db.refresh(novo_agendamento)
    return novo_agendamento

def service_get_meus_agendamentos(db: Session, usuario: Usuario):
    return db.query(Agendamento).filter(Agendamento.usuario_id == usuario.id).all()


def service_listar_agendamentos(db: Session):
    return db.query(Agendamento).all()


def service_get_agendamento_por_id(db: Session, agendamento_id: int):
    return db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()


def service_atualizar_agendamento(db: Session, usuario: Usuario, agendamento_id: int, update_data):
    ag = service_get_agendamento_por_id(db, agendamento_id)
    if not ag:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    if ag.usuario_id != usuario.id:
        raise HTTPException(status_code=403, detail="Sem permissão para modificar este agendamento")

    # update_data vem de .model_dump(), então campos não enviados chegam como None
    data_inicio = update_data.get("data_inicio") or ag.data_inicio
    duracao = update_data.get("duracao_horas") or int((ag.data_fim - ag.data_inicio).total_seconds() // 3600)
    tipo_maquina = update_data.get("tipo_maquina") or ag.tipo_maquina

    if duracao not in (1, 2):
        raise HTTPException(status_code=400, detail="Duração deve ser 1 ou 2 horas")

    data_fim = data_inicio + timedelta(hours=duracao)

    dias_permitidos, _ = get_dias_permitidos(usuario) # Ignora a descrição
    if data_inicio.weekday() not in dias_permitidos:
        raise HTTPException(status_code=403, detail="Você não tem permissão para agendar neste dia da semana.")

    conflito = db.query(Agendamento).filter(
        (Agendamento.id != agendamento_id) &
        (Agendamento.tipo_maquina == tipo_maquina) &
        (Agendamento.data_inicio < data_fim) & (Agendamento.data_fim > data_inicio)
    ).first()

    if conflito:
        raise HTTPException(status_code=409, detail="Horário indisponível. Outro usuário já agendou.")

    ag.data_inicio = data_inicio
    ag.data_fim = data_fim
    ag.tipo_maquina = tipo_maquina

    db.add(ag)
    db.commit()
    db.refresh(ag)
    return ag


def service_deletar_agendamento(db: Session, usuario: Usuario, agendamento_id: int):
    ag = service_get_agendamento_por_id(db, agendamento_id)
    if not ag:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    if ag.usuario_id != usuario.id:
        raise HTTPException(status_code=403, detail="Sem permissão para deletar este agendamento")
    db.delete(ag)
    db.commit()
    return True