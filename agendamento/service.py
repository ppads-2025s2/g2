from datetime import datetime, timedelta, time
from fastapi import HTTPException
from sqlmodel import Session, select
from entities.agendamentos import Agendamento
from entities.alunos import Aluno

# Janela de atendimento
HORARIO_ABERTURA = time(hour=8)
HORARIO_FECHAMENTO = time(hour=18)

# Seg(0), Ter(1), Qua(2), Qui(3), Sex(4)
DIAS_TFG = {0, 1, 3}   # preferenciais para quem está em TCC/TFG
DIAS_REG = {2, 4}      # preferenciais para regulares (3º–8º)

def _preferidos(is_tfg: bool) -> set[int]:
    return DIAS_TFG if is_tfg else DIAS_REG

def _eh_mesmo_dia(d1: datetime, d2: datetime) -> bool:
    return d1.date() == d2.date()

def get_next_start_time(db_session: Session, hour_number: int, is_tfg: bool) -> datetime:
    now = datetime.now().replace(minute=0, second=0, microsecond=0)

    if now.time() < HORARIO_ABERTURA:
        next_start = datetime.combine(now.date(), HORARIO_ABERTURA)
    else:
        next_start = now  # arredondado acima

    preferidos = _preferidos(is_tfg)

    st = (
        select(Agendamento)
        .where(Agendamento.status != "cancelado", Agendamento.data_inicio != None)
        .order_by(Agendamento.data_inicio)
    )
    agendamentos = db_session.exec(st).all()

    for _ in range(200):
        weekday = next_start.weekday()
        proposed_end = next_start + timedelta(hours=hour_number)

        # Respeita janela 08:00–18:00
        if next_start.time() < HORARIO_ABERTURA:
            next_start = datetime.combine(next_start.date(), HORARIO_ABERTURA)
            continue
        if proposed_end.time() > HORARIO_FECHAMENTO:
            next_start = datetime.combine(next_start.date() + timedelta(days=1), HORARIO_ABERTURA)
            continue

        # Prioridade por dia; se não for dia preferido do grupo, só libera no MESMO DIA (liberação de última hora)
        dia_preferido = weekday in preferidos
        if not dia_preferido and not _eh_mesmo_dia(now, next_start):
            next_start = datetime.combine(next_start.date() + timedelta(days=1), HORARIO_ABERTURA)
            continue

        # Checagem de conflito
        conflito = False
        for ag in agendamentos:
            if ag.status == "cancelado":
                continue
            if next_start < ag.data_fim and proposed_end > ag.data_inicio:
                next_start = ag.data_fim
                conflito = True
                break
        if conflito:
            continue

        return next_start

    raise HTTPException(status_code=404, detail="Não foi possível encontrar horário disponível")

def create_agendamento(db_session: Session, current_user, hour_number: int) -> Agendamento:
    aluno = db_session.get(Aluno, current_user.aluno_id)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    inicio = get_next_start_time(db_session, hour_number, bool(aluno.doing_tcc))
    fim = inicio + timedelta(hours=hour_number)

    # Janela válida
    if not (HORARIO_ABERTURA <= inicio.time() < HORARIO_FECHAMENTO and
            HORARIO_ABERTURA < fim.time() <= HORARIO_FECHAMENTO):
        raise HTTPException(status_code=400, detail="Horário fora do período permitido")

    ag = Agendamento(
        aluno_id=current_user.aluno_id,
        data_inicio=inicio,
        data_fim=fim,
        horas_necessarias=hour_number,
        status="pendente",
    )
    db_session.add(ag)
    db_session.commit()
    db_session.refresh(ag)
    return ag

def get_agendamento(db_session: Session, agendamento_id: int) -> Agendamento:
    ag = db_session.get(Agendamento, agendamento_id)
    if not ag:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return ag

def list_agendamentos(db_session: Session):
    return db_session.exec(select(Agendamento)).all()

def delete_agendamento(db_session: Session, agendamento_id: int) -> bool:
    ag = get_agendamento(db_session, agendamento_id)
    ag.status = "cancelado"
    ag.updated_at = datetime.utcnow()
    db_session.add(ag)
    db_session.commit()
    return True

def update_agendamento(db_session: Session, agendamento_id: int, data: dict) -> Agendamento:
    ag = get_agendamento(db_session, agendamento_id)
    for k, v in data.items():
        if hasattr(ag, k):
            setattr(ag, k, v)
    ag.updated_at = datetime.utcnow()
    db_session.add(ag)
    db_session.commit()
    db_session.refresh(ag)
    return ag
