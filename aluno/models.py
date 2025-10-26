# aluno/models.py
from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr
from datetime import datetime

class AlunoBase(SQLModel):
    email: EmailStr = Field(index=True)
    nome: Optional[str] = Field(default=None, max_length=100)
    tia: int                                            # vem como int no Swagger
    curso: Optional[str] = Field(default=None, max_length=100)
    semestre: int
    doing_tcc: bool = Field(default=False)
    active: bool = Field(default=True)

class AlunoCreate(AlunoBase):
    senha: str = Field(max_length=255)

class AlunoRead(AlunoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}

class AlunoUpdate(SQLModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    tia: Optional[int] = None
    curso: Optional[str] = None
    semestre: Optional[int] = None
    doing_tcc: Optional[bool] = None
    active: Optional[bool] = None
    senha: Optional[str] = None
