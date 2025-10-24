from dotenv import load_dotenv
import os
from pathlib import Path

# Encontra o arquivo .env
env_path = Path('.') / '.env'
load_dotenv(env_path)

# Configurações do banco de dados
DATABASE_URL = os.getenv("DB_STRING")

# Configurações de segurança
SECRET_KEY = os.getenv("SECRET_KEY")
SALT = os.getenv("SALT")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY não encontrada no arquivo .env")
if not SALT:
    raise ValueError("SALT não encontrada no arquivo .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30