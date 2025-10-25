from datetime import datetime, time, timedelta
from fastapi import HTTPException
from sqlmodel import Session, select
from .models import Agendamento
from aluno.service import get_current_user
from aluno.models import Aluno

HORARIO_ABERTURA = time(hour=8)
HORARIO_FECHAMENTO = time(hour=18)

def get_next_start_time(db_session, hour_number: int):
    """
    Busca o próximo horário disponível seguindo as regras:
    1. Validar se o período está no horário permitido
    2. Validar o número de horas necessárias para não passar o horário de fechamento
    3. Validar o próximo horário disponível e retornar esse valor
    """
    now = datetime.now()
    
    if now.time() < HORARIO_ABERTURA:
        next_start = datetime.combine(now.date(), HORARIO_ABERTURA)
    else:
        next_start = now.replace(minute=0, second=0, microsecond=0)
        if now.minute > 0 or now.second > 0:
            next_start += timedelta(hours=1)

    statement = select(Agendamento).where(
        Agendamento.status == "pendente",
        Agendamento.data_inicio != None
    ).order_by(Agendamento.data_inicio)
    agendamentos = db_session.exec(statement).all()

    max_attempts = 100 
    attempt = 0
    
    while attempt < max_attempts: 
        proposed_end_time = next_start + timedelta(hours=hour_number)
        if next_start.time() < HORARIO_ABERTURA:
            next_start = datetime.combine(next_start.date(), HORARIO_ABERTURA)
            continue
        
        if proposed_end_time.time() > HORARIO_FECHAMENTO:
            next_start = datetime.combine(
                next_start.date() + timedelta(days=1), 
                HORARIO_ABERTURA
            )
            attempt += 1
            continue
        
        is_available = True
        for agendamento in agendamentos:
            if (next_start < agendamento.data_fim and proposed_end_time > agendamento.data_inicio):
                next_start = agendamento.data_fim
                is_available = False
                break
        
        if is_available:
            return next_start
        
        attempt += 1
    
    raise HTTPException(
        status_code=404,
        detail="Não foi possível encontrar um horário disponível nas próximas semanas"
    )

def create_agendamento(db_session, current_user, hour_number):
    aluno = db_session.get(Aluno, current_user.id)
    if not aluno:
        raise HTTPException(
            status_code=404,
            detail="Aluno não encontrado"
        )
    horario_inicio = get_next_start_time(db_session, hour_number)
    horario_fim = horario_inicio + timedelta(hours=hour_number)
    # Verifica se o horário está dentro do permitido
    if not (HORARIO_ABERTURA <= horario_inicio.time() < HORARIO_FECHAMENTO and 
            HORARIO_ABERTURA < horario_fim.time() <= HORARIO_FECHAMENTO):
        raise HTTPException(
            status_code=400,
            detail="Horário fora do período permitido"
        )
    agendamento = Agendamento(
        aluno_id=current_user.id,
        data_inicio=horario_inicio,
        data_fim=horario_fim,
        horas_necessarias=hour_number
    )
    db_session.add(agendamento)
    db_session.commit()
    db_session.refresh(agendamento)
    return agendamento

def get_agendamento(db_session, agendamento_id: int):
    agendamento = db_session.get(Agendamento, agendamento_id)
    if not agendamento:
        raise HTTPException(
            status_code=404,
            detail="Agendamento não encontrado"
        )
    return agendamento

def list_agendamentos(db_session):
    return db_session.query(Agendamento).all()

def delete_agendamento(db_session, agendamento_id: int):
    agendamento = get_agendamento(db_session, agendamento_id)
    agendamento.status = "cancelado"
    db_session.add(agendamento)
    db_session.commit()
    db_session.refresh(agendamento)
    return True

def update_agendamento(db_session, agendamento_id: int, dados_atualizacao: dict):
    agendamento = get_agendamento(db_session, agendamento_id)
    for campo, valor in dados_atualizacao.items():
        if hasattr(agendamento, campo):
            setattr(agendamento, campo, valor)
    
    agendamento.updated_at = datetime.now()
    db_session.add(agendamento)
    db_session.commit()
    db_session.refresh(agendamento)
    return agendamento