from database.database import Base, engine
# Importa as *classes* das tabelas para que o SQLAlchemy as reconheça
from entities.alunos import Usuario
from entities.agendamentos import Agendamento

print("Criando tabelas no banco de dados...")

# Cria todas as tabelas (Base.metadata.create_all)
try:
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")
except Exception as e:
    print(f"Erro ao criar tabelas: {e}")