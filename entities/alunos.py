from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr, constr

class AlunoBase(SQLModel):
    nome: str = Field(max_length=100)
    tia: int = Field(index=True)
    email: EmailStr = Field(index=True)
    curso: str = Field(max_length=100)
    semestre: int = Field()

class Aluno(AlunoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    senha: str = Field(max_length=255)

class AlunoCreate(AlunoBase):
    senha: str = Field(max_length=255)

class AlunoRead(AlunoBase):
    id: int

class AlunoUpdate(SQLModel):
    nome: Optional[str] = None
    tia: Optional[int] = None
    email: Optional[EmailStr] = None
    curso: Optional[str] = None
    semestre: Optional[int] = None
    senha: Optional[str] = None