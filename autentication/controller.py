from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from database.config import get_db
from autentication.models import Token, TokenData, RegisterRequest, RegisterResponse, LoginRequest
from autentication.service import (
    register_user,
    authenticate_user,
    create_access_token,
    get_current_user
)

router = APIRouter()

@router.post(
    "/register",
    response_model=RegisterResponse,
    response_model_exclude_none=True,
    status_code=status.HTTP_201_CREATED,
    description="Registra um novo aluno no sistema",
    responses={
        201: {
            "description": "Aluno registrado com sucesso",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "token_type": "bearer",
                        "aluno_id": 1
                    }
                }
            }
        },
        400: {
            "description": "Email ou TIA já cadastrado"
        }
    }
)
async def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
) -> RegisterResponse:
    """
    Registra um novo aluno no sistema.

    Parameters:
    - email: Email do aluno (deve ser válido)
    - nome: Nome completo do aluno
    - tia: Número TIA do aluno
    - curso: Nome do curso
    - semestre: Semestre atual
    - senha: Senha para acesso

    Returns:
    - Token de acesso JWT
    - Tipo do token (bearer)
    - ID do aluno registrado
    """
    return register_user(register_data, db)

@router.post(
    "/token",
    response_model=Token,
    description="Obtém um token de acesso através do login",
)
async def login_for_access_token(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
) -> Token:
    """
    Obtém um token de acesso JWT através do login.
    
    - **email**: Email do aluno
    - **senha**: Senha do aluno
    
    Retorna um token JWT que deve ser usado no cabeçalho Authorization das requisições.
    """
    user = authenticate_user(login_data.email, login_data.senha, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        email=user.email,
        aluno_id=user.id
    )
    
    return Token(access_token=access_token, token_type="bearer")

@router.get(
    "/me",
    response_model=TokenData,
    response_model_exclude_none=True,
    description="Retorna os dados do usuário autenticado",
    responses={
        200: {
            "description": "Dados do usuário autenticado",
            "content": {
                "application/json": {
                    "example": {
                        "email": "aluno@maua.br",
                        "aluno_id": 1
                    }
                }
            }
        },
        401: {
            "description": "Token inválido ou expirado"
        }
    }
)
def read_users_me(
    current_user: Annotated[TokenData, Depends(get_current_user)]
) -> TokenData:
    """
    Retorna os dados do usuário atualmente autenticado.

    Requer autenticação através do token JWT.
    Use o botão 'Authorize' no topo da página e insira o token no formato:
    Bearer <seu-token-jwt>

    Returns:
    - email: Email do aluno autenticado
    - aluno_id: ID do aluno no sistema
    """
    return current_user

