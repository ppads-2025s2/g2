from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr

class Aluno(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tia: Optional[str] = Field(default=None, unique=True, max_length=50)  
    email: Optional[EmailStr] = Field(default=None, unique=True)
    nome: Optional[str] = Field(default=None, max_length=100)            
    curso: Optional[str] = Field(default=None, max_length=100)            
    semestre: Optional[int] = Field(default=None)
    doing_tcc: bool = Field(default=False)
    senha_hash: Optional[str] = Field(default=None, max_length=255)
    active: bool = Field(default=True)
    admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None, nullable=True)
    
    model_config = {
        "arbitrary_types_allowed": True
    }
