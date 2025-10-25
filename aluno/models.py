from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr
from datetime import datetime

class AlunoBase(SQLModel):
    matricula: int = Field(index=True)
    email: EmailStr = Field(index=True)
    curso_id: int = Field()
    semestre: int = Field()
    doing_tcc: bool = Field(default=False)
    active: bool = Field(default=True)

class Aluno(AlunoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    senha: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AlunoCreate(AlunoBase):
    senha: str = Field(max_length=255)
    confirm_senha: str = Field(max_length=255)

class AlunoRead(AlunoBase):
    id: int
    created_at: datetime
    updated_at: datetime

class AlunoUpdate(SQLModel):
    matricula: Optional[int] = None
    email: Optional[EmailStr] = None
    curso_id: Optional[int] = None
    semestre: Optional[int] = None
    doing_tcc: Optional[bool] = None
    active: Optional[bool] = None
    senha: Optional[str] = None

class ChangePassword(SQLModel):
    aluno_id: int = Field()
    email: EmailStr = Field()
    senha_antiga: str = Field(max_length=255)
    nova_senha: str = Field(max_length=255)