from datetime import datetime, timedelta, time
from fastapi import HTTPException
from sqlmodel import Session, select
from entities.agendamentos import Agendamento
from entities.alunos import Aluno

HORARIO_ABERTURA = time(hour=8)
HORARIO_FECHAMENTO = time(hour=18)

def get_next_start_time(db_session: Session, hour_number: int) -> datetime:
    now = datetime.now()
    if now.time() < HORARIO_ABERTURA:
        next_start = datetime.combine(now.date(), HORARIO_ABERTURA)
    else:
        next_start = now.replace(minute=0, second=0, microsecond=0)
        if now.minute > 0 or now.second > 0:
            next_start += timedelta(hours=1)

    st = (
        select(Agendamento)
        .where(Agendamento.status == "pendente", Agendamento.data_inicio != None)
        .order_by(Agendamento.data_inicio)
    )
    agendamentos = db_session.exec(st).all()

    max_attempts = 100
    attempt = 0
    while attempt < max_attempts:
        proposed_end = next_start + timedelta(hours=hour_number)

        if next_start.time() < HORARIO_ABERTURA:
            next_start = datetime.combine(next_start.date(), HORARIO_ABERTURA)
            continue

        if proposed_end.time() > HORARIO_FECHAMENTO:
            next_start = datetime.combine(next_start.date() + timedelta(days=1), HORARIO_ABERTURA)
            attempt += 1
            continue

        is_available = True
        for ag in agendamentos:
            if next_start < ag.data_fim and proposed_end > ag.data_inicio:
                next_start = ag.data_fim
                is_available = False
                break

        if is_available:
            return next_start

        attempt += 1

    raise HTTPException(status_code=404, detail="Não foi possível encontrar horário disponível")

def create_agendamento(db_session: Session, current_user, hour_number: int) -> Agendamento:
    aluno = db_session.get(Aluno, current_user.id)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    inicio = get_next_start_time(db_session, hour_number)
    fim = inicio + timedelta(hours=hour_number)

    if not (HORARIO_ABERTURA <= inicio.time() < HORARIO_FECHAMENTO and
            HORARIO_ABERTURA < fim.time() <= HORARIO_FECHAMENTO):
        raise HTTPException(status_code=400, detail="Horário fora do período permitido")

    ag = Agendamento(
        aluno_id=current_user.id,
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
    ag.updated_at = datetime.now()
    db_session.add(ag)
    db_session.commit()
    return True

def update_agendamento(db_session: Session, agendamento_id: int, data: dict) -> Agendamento:
    ag = get_agendamento(db_session, agendamento_id)
    for k, v in data.items():
        if hasattr(ag, k):
            setattr(ag, k, v)
    ag.updated_at = datetime.now()
    db_session.add(ag)
    db_session.commit()
    db_session.refresh(ag)
    return ag
