from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Annotated
from database.config import get_db
from autentication.service import get_current_user
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
    # Dica: se quiser listar só do usuário, aplique filtro no service.
    return list_agendamentos(db)

@router.post("", response_model=AgendamentoRead, status_code=status.HTTP_201_CREATED)
def criar(
    body: AgendamentoCreate,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    return create_agendamento(db, current_user, body.horas_necessarias)

@router.get("/{agendamento_id}", response_model=AgendamentoRead)
def obter(
    agendamento_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    ag = get_agendamento(db, agendamento_id)
    if ag.aluno_id != current_user.aluno_id and not getattr(current_user, "admin", False):
        raise HTTPException(status_code=403, detail="Sem permissão")
    return ag

@router.delete("/{agendamento_id}")
def cancelar(
    agendamento_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
):
    ag = get_agendamento(db, agendamento_id)
    if ag.aluno_id != current_user.aluno_id and not getattr(current_user, "admin", False):
        raise HTTPException(status_code=403, detail="Sem permissão")

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
    ag = get_agendamento(db, agendamento_id)
    if ag.aluno_id != current_user.aluno_id and not getattr(current_user, "admin", False):
        raise HTTPException(status_code=403, detail="Sem permissão")

    return update_agendamento(db, agendamento_id, body.dict(exclude_unset=True))
