from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr

class Aluno(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    tia: str = Field(default=None, unique=True)
    email: EmailStr = Field(default=None, unique=True)
    curso_id: int = Field(default=None)
    semestre: int = Field(default=None)
    doing_tcc: bool = Field(default=False)
    senha_hash: str = Field(default=None)
    active: bool = Field(default=True)
    admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default=None, nullable=True)

    model_config = {
        "arbitrary_types_allowed": True
    }
