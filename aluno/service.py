# aluno/service.py
from sqlmodel import Session, select
from aluno.models import AlunoCreate, AlunoUpdate
from entities.alunos import Aluno
from fastapi import HTTPException, status
from typing import List
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_aluno(db: Session, aluno_id: int) -> Aluno:
    statement = select(Aluno).where(Aluno.id == aluno_id)
    aluno = db.exec(statement).first()
    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado"
        )
    return aluno

def get_aluno_by_email(db: Session, email: str) -> Aluno | None:
    statement = select(Aluno).where(Aluno.email == email)
    return db.exec(statement).first()

def get_aluno_by_tia(db: Session, tia: int) -> Aluno | None:
    # tia no banco é VARCHAR, então compare como string
    statement = select(Aluno).where(Aluno.tia == str(tia))
    return db.exec(statement).first()

def get_alunos(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    curso: str | None = None
) -> List[Aluno]:
    statement = select(Aluno)
    if curso:
        statement = statement.where(Aluno.curso == curso)
    statement = statement.offset(skip).limit(limit)
    return db.exec(statement).all()

def create_aluno(db: Session, aluno_create: AlunoCreate) -> Aluno:
    # Verifica duplicidade
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
        aluno = Aluno(
            email=aluno_create.email,
            nome=aluno_create.nome,
            tia=str(aluno_create.tia),                 # <- converte int -> str
            curso=aluno_create.curso,
            semestre=aluno_create.semestre,
            doing_tcc=aluno_create.doing_tcc,
            active=aluno_create.active,
            senha_hash=pwd_context.hash(aluno_create.senha),
        )
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
    aluno = get_aluno(db, aluno_id)
    
    # Verifica duplicidade em email/tia
    if "email" in aluno_data and aluno_data["email"] != aluno.email:
        existing_aluno = get_aluno_by_email(db, aluno_data["email"])
        if existing_aluno and existing_aluno.id != aluno_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
    
    if "tia" in aluno_data and str(aluno_data["tia"]) != aluno.tia:
        existing_aluno = get_aluno_by_tia(db, aluno_data["tia"])
        if existing_aluno and existing_aluno.id != aluno_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="TIA já cadastrado"
            )
        # garanta que ficará como string no modelo
        aluno_data["tia"] = str(aluno_data["tia"])
    
    # Hash de senha → senha_hash
    if "senha" in aluno_data:
        aluno_data["senha_hash"] = pwd_context.hash(aluno_data.pop("senha"))
    
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
