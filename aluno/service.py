from sqlmodel import Session, select
from entities.alunos import Aluno, AlunoCreate, AlunoUpdate
from fastapi import HTTPException, status
from typing import List
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_aluno(db: Session, aluno_id: int) -> Aluno:
    """
    Busca um aluno pelo ID
    """
    statement = select(Aluno).where(Aluno.id == aluno_id)
    aluno = db.exec(statement).first()
    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado"
        )
    return aluno

def get_aluno_by_email(db: Session, email: str) -> Aluno:
    """
    Busca um aluno pelo email
    """
    statement = select(Aluno).where(Aluno.email == email)
    return db.exec(statement).first()

def get_aluno_by_tia(db: Session, tia: int) -> Aluno:
    """
    Busca um aluno pelo TIA
    """
    statement = select(Aluno).where(Aluno.tia == tia)
    return db.exec(statement).first()

def get_alunos(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    curso: str = None
) -> List[Aluno]:
    """
    Lista todos os alunos com paginação e filtro opcional por curso
    """
    statement = select(Aluno)
    if curso:
        statement = statement.where(Aluno.curso == curso)
    statement = statement.offset(skip).limit(limit)
    return db.exec(statement).all()

def create_aluno(db: Session, aluno_create: AlunoCreate) -> Aluno:
    """
    Cria um novo aluno
    """
    # Verifica se já existe aluno com mesmo email ou TIA
    if get_aluno_by_email(db, aluno_create.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    if get_aluno_by_tia(db, aluno_create.tia):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TIA já cadastrado"
        )
    
    try:
        # Hash da senha antes de salvar
        aluno_dict = aluno_create.dict()
        aluno_dict["senha"] = pwd_context.hash(aluno_create.senha)
        aluno = Aluno(**aluno_dict)
        
        db.add(aluno)
        db.commit()
        db.refresh(aluno)
        return aluno
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao criar aluno"
        )

def update_aluno(db: Session, aluno_id: int, aluno_data: dict) -> Aluno:
    """
    Atualiza os dados de um aluno
    """
    aluno = get_aluno(db, aluno_id)
    
    # Se estiver atualizando email ou TIA, verifica se já existe
    if "email" in aluno_data and aluno_data["email"] != aluno.email:
        existing_aluno = get_aluno_by_email(db, aluno_data["email"])
        if existing_aluno and existing_aluno.id != aluno_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
    
    if "tia" in aluno_data and aluno_data["tia"] != aluno.tia:
        existing_aluno = get_aluno_by_tia(db, aluno_data["tia"])
        if existing_aluno and existing_aluno.id != aluno_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="TIA já cadastrado"
            )
    
    # Se estiver atualizando a senha, faz o hash
    if "senha" in aluno_data:
        aluno_data["senha"] = pwd_context.hash(aluno_data["senha"])
    
    try:
        for key, value in aluno_data.items():
            setattr(aluno, key, value)
        db.commit()
        db.refresh(aluno)
        return aluno
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao atualizar aluno"
        )

def delete_aluno(db: Session, aluno_id: int) -> Aluno:
    """
    Remove um aluno
    """
    aluno = get_aluno(db, aluno_id)
    try:
        db.delete(aluno)
        db.commit()
        return aluno
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao deletar aluno. Verifique se não há dependências."
        )
