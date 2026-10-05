from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from typing import List
from agendamentos.models import AgendamentoCreate, AgendamentoPublic, AgendamentoUpdate
from agendamentos.service import (
    service_get_horarios_disponiveis,
    service_criar_agendamento,
    service_get_meus_agendamentos,
    service_listar_agendamentos,
    service_get_agendamento_por_id,
    service_atualizar_agendamento,
    service_deletar_agendamento,
)
from auth.service import get_usuario_logado
from entities.agendamentos import MaquinaEnum
from entities.alunos import Usuario

router = APIRouter()

@router.get("/agendamentos/disponiveis")
def get_horarios_disponiveis(
    tipo_maquina: MaquinaEnum | None = None,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_logado)
):
    """
    (PROTEGIDO) Retorna a lista de slots vagos (horários) que o usuário logado
    tem permissão para agendar. Se 'tipo_maquina' for informado, considera
    apenas os agendamentos daquela máquina.
    """
    return service_get_horarios_disponiveis(db, usuario, tipo_maquina)


@router.post("/agendamentos", response_model=AgendamentoPublic, status_code=status.HTTP_201_CREATED)
def criar_agendamento(
    agendamento_data: AgendamentoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_logado)
):
    """
    (PROTEGIDO) Cria um novo agendamento para o usuário logado.
    Verifica as regras de dia e de conflito.
    """
    try:
        novo_agendamento = service_criar_agendamento(db, usuario, agendamento_data)
        return novo_agendamento
    except HTTPException as e:
        raise e # Repassa exceções (ex: "Horário indisponível")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/meus_agendamentos", response_model=List[AgendamentoPublic])
def get_meus_agendamentos(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_logado)
):
    """
    (PROTEGIDO) Retorna a lista de agendamentos feitos 
    pelo usuário que está logado.
    """
    return service_get_meus_agendamentos(db, usuario)


@router.get("/agendamentos", response_model=List[AgendamentoPublic])
def listar_agendamentos(db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    """Lista todos os agendamentos (protegido)."""
    return service_listar_agendamentos(db)


@router.get("/agendamentos/{agendamento_id}", response_model=AgendamentoPublic)
def obter_agendamento(agendamento_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    ag = service_get_agendamento_por_id(db, agendamento_id)
    if not ag:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return ag


@router.put("/agendamentos/{agendamento_id}", response_model=AgendamentoPublic)
def atualizar_agendamento(agendamento_id: int, update: AgendamentoUpdate, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    try:
        ag = service_atualizar_agendamento(db, usuario, agendamento_id, update.model_dump())
        return ag
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/agendamentos/{agendamento_id}")
def deletar_agendamento(agendamento_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    service_deletar_agendamento(db, usuario, agendamento_id)
    return {"detail": "Agendamento deletado"}