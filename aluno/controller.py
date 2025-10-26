from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional
from database.config import get_db
from entities.alunos import Aluno
from aluno.models import AlunoCreate, AlunoRead, AlunoUpdate
from aluno.service import (
    get_aluno,
    get_alunos,
    create_aluno,
    update_aluno,
    delete_aluno
)
from autentication.service import get_current_user
from typing import Annotated
from autentication.models import TokenData

router = APIRouter()

@router.get("", response_model=List[AlunoRead])
async def listar_alunos(
    *,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
    skip: int = 0,
    limit: int = 100,
    curso: Optional[str] = None
):
    """
    Lista todos os alunos cadastrados.
    
    Parâmetros:
    - skip: Número de registros para pular (paginação)
    - limit: Número máximo de registros a retornar
    - curso: Filtro opcional por curso
    
    Requer autenticação.
    """
    return get_alunos(db, skip=skip, limit=limit, curso=curso)

@router.get("/{aluno_id}", response_model=Aluno)
async def buscar_aluno(
    aluno_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None
):
    """
    Busca um aluno pelo ID.
    
    Requer autenticação.
    """
    return get_aluno(db, aluno_id)

@router.post("", response_model=Aluno, status_code=status.HTTP_201_CREATED)
async def criar_aluno(
    *,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
    aluno: Aluno
):
    """
    Cria um novo aluno.
    
    Requer autenticação.
    """
    return create_aluno(db, aluno)

@router.patch("/{aluno_id}", response_model=Aluno)
async def atualizar_aluno(
    *,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None,
    aluno_id: int,
    aluno_data: AlunoUpdate
):
    """
    Atualiza os dados de um aluno.
    
    Requer autenticação.
    """
    return update_aluno(db, aluno_id, aluno_data.dict(exclude_unset=True))

@router.delete("/{aluno_id}", response_model=Aluno)
async def remover_aluno(
    aluno_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[TokenData, Depends(get_current_user)] = None
):
    """
    Remove um aluno.
    
    Requer autenticação.
    """
    return delete_aluno(db, aluno_id)