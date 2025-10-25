from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from .service import AgendamentoService
from .models import AgendamentoCreate
from database.config import get_db
from autentication.service import get_current_user

router = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"]
)

@router.get("/")
def listar_agendamentos(
    db: Session = Depends(get_db)
):
    service = AgendamentoService(db)
    return service.listar_agendamentos()

@router.post("/")
def criar_agendamento(
    horas_necessarias: int = 1,
    db: Session = Depends(get_db),
    usuario_atual = Depends(get_current_user)
):
    service = AgendamentoService(db)
    return service.criar_agendamento(usuario_atual, horas_necessarias)

@router.get("/{agendamento_id}")
def obter_agendamento(
    agendamento_id: int,
    db: Session = Depends(get_db)
):
    service = AgendamentoService(db)
    agendamento = service.obter_agendamento(agendamento_id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return agendamento

@router.delete("/{agendamento_id}")
def cancelar_agendamento(
    agendamento_id: int,
    db: Session = Depends(get_db)
):
    service = AgendamentoService(db)
    sucesso = service.cancelar_agendamento(agendamento_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return {"mensagem": "Agendamento cancelado com sucesso"}
