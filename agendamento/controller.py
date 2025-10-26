from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional, List
from database.config import get_db
from autentication.service import get_current_user
from typing import Annotated
from autentication.models import TokenData

from agendamento.models import AgendamentoCreate, AgendamentoRead, AgendamentoUpdate
from agendamento.service import (
    get_agendamento, list_agendamentos, create_agendamento, update_agendamento, delete_agendamento
)

router = APIRouter()

@router.get("", response_model=List[AgendamentoRead])
def listar_agendamentos(
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    return list_agendamentos(db)

@router.post("", response_model=AgendamentoRead, status_code=status.HTTP_201_CREATED)
def criar(
    horas_necessarias: int = 1,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    return create_agendamento(db, current_user, horas_necessarias)

@router.get("/{agendamento_id}", response_model=AgendamentoRead)
def obter(
    agendamento_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    return get_agendamento(db, agendamento_id)

@router.delete("/{agendamento_id}")
def cancelar(
    agendamento_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    ok = delete_agendamento(db, agendamento_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return {"mensagem": "Agendamento cancelado com sucesso"}

@router.patch("/{agendamento_id}", response_model=AgendamentoRead)
def atualizar(
    agendamento_id: int,
    body: AgendamentoUpdate,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    return update_agendamento(db, agendamento_id, body.dict(exclude_unset=True))
