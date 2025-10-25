from datetime import datetime, time, timedelta
from fastapi import HTTPException
from sqlmodel import Session, select
from .models import Agendamento
from aluno.service import get_current_user

HORARIO_ABERTURA = time(hour=8)
HORARIO_FECHAMENTO = time(hour=18)

def get_next_start_time(db_session, hour_number: int):
    """
    Busca o próximo horário disponível seguindo as regras:
    1. Validar se o período está no horário permitido
    2. Validar o número de horas necessárias para não passar o horário de fechamento
    3. Validar o próximo horário disponível e retornar esse valor
    """
    now = datetime.datetime.now()
    
    
    if now.time() < open_hour:
        next_start = datetime.datetime.combine(now.date(), open_hour)
    else:
        next_start = now.replace(minute=0, second=0, microsecond=0)
        if now.minute > 0 or now.second > 0:
            next_start += datetime.timedelta(hours=1)

    statement = select(Agendamento).where(
        Agendamento.status == 0,
        Agendamento.startTime is not None
    ).order_by(Agendamento.startTime)
    agendamentos = db_session.exec(statement).all()
    

    max_attempts = 100 
    attempt = 0
    
    while attempt < max_attempts: 
        proposed_end_time = next_start + datetime.timedelta(hours=hour_number)
        if next_start.time() < open_hour:
            next_start = datetime.datetime.combine(next_start.date(), open_hour)
            continue
        
        if proposed_end_time.time() > close_hour:
            next_start = datetime.datetime.combine(
                next_start.date() + datetime.timedelta(days=1), 
                open_hour
            )
            attempt += 1
            continue
        
        is_available = True
        for agendamento in agendamentos:
            if (next_start < agendamento.endTime and proposed_end_time > agendamento.startTime):
                next_start = agendamento.endTime
                is_available = False
                break
        
        if is_available:
            return next_start
        
        attempt += 1
    
    raise NotFoundException("Não foi possível encontrar um horário disponível nas próximas semanas")

def create_agendamento(db_session, current_user, hour_number):
    aluno = get_aluno(db_session, current_user.aluno_id)
    if not aluno:
        raise NotFoundException("Aluno não encontrado")
    start_time = get_next_start_time(db_session, hour_number)
    end_time = start_time + datetime.timedelta(hours=hour_number)
    # Verifica se o horário está dentro do permitido
    if not (open_hour <= start_time.time() < close_hour and open_hour < end_time.time() <= close_hour):
        raise NotFoundException("Horário fora do período permitido")
    agendamento = Agendamento(
        aluno_id=current_user.aluno_id,
        curso_id=aluno.curso_id,
        startTime=start_time,
        endTime=end_time
    )
    db_session.add(agendamento)
    db_session.commit()
    db_session.refresh(agendamento)
    return agendamento

def get_agendamento(db_session, agendamento_id: int):
    return db_session.get(Agendamento, agendamento_id)

def list_agendamentos(db_session):
    return db_session.query(Agendamento).all()

def delete_agendamento(db_session, agendamento_id: int):
    agendamento = get_agendamento(db_session, agendamento_id)
    if agendamento:
        agendamento.status = 1  
        db_session.add(agendamento)
        db_session.commit()
        db_session.refresh(agendamento)
        return True
    return False

def update_agendamento(db_session, agendamento_id: int, agendamento_request: AgendamentoRequest):
    agendamento = get_agendamento(db_session, agendamento_id)
    if agendamento:
        for key, value in agendamento_request.dict().items():
            setattr(agendamento, key, value)
        db_session.add(agendamento)
        db_session.commit()
        db_session.refresh(agendamento)
        return agendamento
    return None