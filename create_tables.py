from sqlmodel import SQLModel
from database.config import engine
from entities.alunos import Aluno
from entities.agendamentos import Agendamento

print("🔄 Criando tabelas no banco de dados...")

SQLModel.metadata.create_all(engine)

print("✅ Tabelas criadas com sucesso!")