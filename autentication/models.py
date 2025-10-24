from sqlmodel import SQLModel
from pydantic import EmailStr
from typing import Optional

class TokenBase(SQLModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        schema_extra = {
            "example": {
                "access_token": "c2cef2af74f3bacb29f7799f201c5ce11ef46bdde55f029c7b06aab27228afef",
                "token_type": "bearer"
            }
        }

class Token(TokenBase):
    class Config:
        schema_extra = {
            "example": {
                "access_token": "c2cef2af74f3bacb29f7799f201c5ce11ef46bdde55f029c7b06aab27228afef",
                "token_type": "bearer"
            }
        }

class TokenData(SQLModel):
    email: EmailStr
    aluno_id: int

    class Config:
        schema_extra = {
            "example": {
                "email": "aluno@maua.br",
                "aluno_id": 1
            }
        }

class RegisterRequest(SQLModel):
    email: EmailStr
    nome: str
    tia: int
    curso: str
    semestre: int
    senha: str

    class Config:
        schema_extra = {
            "example": {
                "email": "aluno@maua.br",
                "nome": "João da Silva",
                "tia": 12345,
                "curso": "Engenharia de Computação",
                "semestre": 5,
                "senha": "senha123"
            }
        }

class RegisterResponse(TokenBase):
    aluno_id: int

    class Config:
        schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "aluno_id": 1
            }
        }

class LoginRequest(SQLModel):
    email: EmailStr
    senha: str

    class Config:
        schema_extra = {
            "example": {
                "email": "aluno@maua.br",
                "senha": "senha123"
            }
        }