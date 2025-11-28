from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- IMPORTS NECESSÁRIOS PARA O BANCO DE DADOS ---
from database.database import engine, Base
from entities.alunos import Usuario 

# --- Importações das suas rotas ---
from alunos.controller import router as aluno_router
from agendamentos.controller import router as agendamento_router
from auth.controller import router as autenticacao_router

# --- CRIAÇÃO DAS TABELAS (O PULO DO GATO) ---
# Isso cria as tabelas automaticamente se elas não existirem ao iniciar o app
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gerenciamento de Impressoras 3D e Laser",
    description="API para alunos agendarem o uso de equipamentos."
)

# --- Configuração do CORS ---
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# --- Inclusão das Rotas ---
app.include_router(aluno_router, prefix="/api", tags=["Aluno"])
app.include_router(autenticacao_router, prefix="/api", tags=["Autenticação"])
app.include_router(agendamento_router, prefix="/api", tags=["Agendamento"])

# --- Rota Principal ---
@app.get("/api")
def read_root():
    return {"status": "API online e funcionando!"}