from fastapi import FastAPI, HTTPException, APIRouter, Depends, Security
from autentication.controller import router as auth_router
from sqlmodel import SQLModel
from database.config import engine, get_db
from entities.alunos import Aluno
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer

SQLModel.metadata.create_all(engine)

app = FastAPI(
    title="Backend API",
    description="API de Backend com autenticação e gerenciamento de alunos",
    version="1.0.0",
    swagger_ui_parameters={"defaultModelsExpandDepth": 0},
    openapi_tags=[
        {"name": "Authentication", "description": "Operações de autenticação"},
        {"name": "Alunos", "description": "Operações relacionadas a alunos"}
    ],
    openapi_security=[{"bearerAuth": []}],
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importa o router de alunos
from aluno.controller import router as aluno_router

# Configuração do esquema de segurança Bearer
app.add_middleware(CORSMiddleware)  # Keep CORS configuration

app.openapi_components = {
    "securitySchemes": {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
}

# Inclui os routers na aplicação
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"],
    responses={401: {"description": "Não autorizado"}},
)

app.include_router(
    aluno_router,
    prefix="/api/alunos",
    tags=["Alunos"],
    responses={401: {"description": "Não autorizado"}}
)

@app.get("/", tags=["Root"])
async def root():
    """
    Endpoint raiz para verificar se a API está funcionando.
    """
    return {"message": "API is running"}
