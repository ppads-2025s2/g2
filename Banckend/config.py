from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# Carrega o arquivo .env
load_dotenv()

class Settings(BaseSettings):
    DB_STRING: str = os.getenv("DB_STRING")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    SALT: str = os.getenv("SALT") 
                                 
    
    class Config:
        env_file = ".env"

# Cria uma instância das configurações para ser usada por outros arquivos
settings = Settings()