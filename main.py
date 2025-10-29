from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from sqlmodel import SQLModel
from database.config import create_db_and_tables  # usa a função do seu config

# Routers
from autentication.controller import router as auth_router
from aluno.controller import router as aluno_router
from agendamento.controller import router as agendamento_router

# ----------------------------------------------------------------------
# APP
# ----------------------------------------------------------------------
app = FastAPI(
    title="Backend API",
    description="API de Backend com autenticação e gerenciamento de alunos",
    version="1.0.0",
    swagger_ui_parameters={"defaultModelsExpandDepth": 0},
    openapi_tags=[
        {"name": "Authentication", "description": "Operações de autenticação"},
        {"name": "Alunos", "description": "Operações relacionadas a alunos"},
        {"name": "Agendamentos", "description": "Operações de agendamento"},
    ],
    # você já usa este campo; manteremos e aplicaremos no openapi custom
    openapi_security=[{"bearerAuth": []}],
)

# Mantém sua definição de componentes para o Bearer
app.openapi_components = {
    "securitySchemes": {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
}

# ----------------------------------------------------------------------
# CORS (mantido conforme você configurou)
# ----------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:5500", "http://127.0.0.1:5500",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------
# Startup: criar tabelas
# ----------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    create_db_and_tables()  # cria se não existir (mantém seu comportamento)

# ----------------------------------------------------------------------
# OpenAPI custom para aplicar suas configs (openapi_components + openapi_security)
# ----------------------------------------------------------------------
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # aplica componentes definidos por você
    if hasattr(app, "openapi_components"):
        comps = app.openapi_components or {}
        schema.setdefault("components", {}).update(comps)

    # aplica segurança global definida por você
    if hasattr(app, "openapi_security"):
        schema["security"] = app.openapi_security or []

    app.openapi_schema = schema
    return app.openapi_schema

app.openapi = custom_openapi

# ----------------------------------------------------------------------
# Rotas (mantidas)
# ----------------------------------------------------------------------
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
    responses={401: {"description": "Não autorizado"}},
)

app.include_router(
    agendamento_router,
    prefix="/api/agendamentos",
    tags=["Agendamentos"],
    responses={401: {"description": "Não autorizado"}},
)

# ----------------------------------------------------------------------
# Root
# ----------------------------------------------------------------------
@app.get("/", tags=["Root"])
def root():
    return {"message": "API is running"}
