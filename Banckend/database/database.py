from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings # Importa a DB_STRING do config.py

# Pega a string de conexão do arquivo .env (via config.py)
SQLALCHEMY_DATABASE_URL = settings.DB_STRING

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Função para injetar a sessão do banco em cada rota da API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()