from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext # Import principal
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from config import settings
from database.database import get_db
from alunos.service import service_get_usuario_por_email
from entities.alunos import Usuario

# --- Configuração de Segurança ---
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- MUDANÇA PRINCIPAL AQUI ---
# Trocamos 'bcrypt' por 'argon2'. Isso resolve o erro 'AttributeError: __about__'.
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
# --- FIM DA MUDANÇA ---

# Esquema do OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# --- Funções de Senha (simplificadas) ---

def verificar_senha(senha_plana: str, senha_hash_db: str):
    """Verifica a senha plana contra o hash do banco (agora com Argon2)"""
    # Não precisamos mais do pré-hash SHA-256
    return pwd_context.verify(senha_plana, senha_hash_db)

def get_hash_senha(senha: str):
    """Cria um hash Argon2 para a senha"""
    # Não precisamos mais do pré-hash SHA-256
    return pwd_context.hash(senha)

# --- Funções de Token JWT (Sem mudanças) ---

def criar_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verificar_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception

# --- Dependência: Obter Usuário Logado (Sem mudanças) ---

def get_usuario_logado(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais (token inválido)",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    email = verificar_token(token, credentials_exception)
    
    usuario = service_get_usuario_por_email(db, email=email)
    if usuario is None:
        raise credentials_exception
    return usuario