from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException, status
import jwt
import hashlib
import hmac
from entities.alunos import Aluno
from jwt import PyJWTError
from fastapi.security import HTTPBearer
import logging
from sqlmodel import Session, select
from autentication.models import TokenData, Token, RegisterRequest, RegisterResponse, LoginRequest
from database.config import get_db
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SALT


security = HTTPBearer()

def get_password_hash(password: str) -> str:
    try:
        # Concatena a senha com o salt e aplica SHA-256
        salted_password = password.encode() + SALT.encode()
        # Usa HMAC para combinar o salt com a senha de forma segura
        hashed = hmac.new(SALT.encode(), salted_password, hashlib.sha256)
        # Retorna o hash em hexadecimal
        return hashed.hexdigest()
    except Exception as e:
        logging.error(f"Erro ao gerar hash da senha: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar a senha"
        )

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Gera o hash da senha fornecida usando o mesmo método
        password_hash = get_password_hash(plain_password)
        # Compara os hashes usando comparação de tempo constante
        return hmac.compare_digest(password_hash.encode(), hashed_password.encode())
    except Exception as e:
        logging.error(f"Erro ao verificar senha: {e}")
        return False
    except Exception as e:
        logging.error(f"Erro ao gerar hash da senha: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar a senha"
        )

def authenticate_user(email: str, password: str, db: Session) -> Aluno | None:
    try:
        user = db.exec(select(Aluno).where(Aluno.email == email)).first()
        if not user or not verify_password(password, user.senha_hash):
            logging.warning(f"Erro de autenticação no email: {email}")
            return None
        return user
    except Exception as e:
        logging.error(f"Erro na autenticação: {e}")
        return None

def create_access_token(email: str, aluno_id: int, expires_delta: timedelta = None) -> str:
    try:
        if expires_delta is None:
            expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode = {
            "sub": email,
            "aluno_id": str(aluno_id),
            "exp": expire,
            "iat": datetime.now(timezone.utc)
        }
        encoded_jwt = jwt.encode(to_encode, str(SECRET_KEY), algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logging.error(f"Erro ao criar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao gerar token de acesso"
        )

def verify_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, str(SECRET_KEY), algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        aluno_id: str = payload.get("aluno_id")
        
        if email is None or aluno_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return TokenData(email=email, aluno_id=int(aluno_id))
    except PyJWTError as e:
        logging.error(f"Erro ao decodificar o token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: Annotated[str, Depends(security)]) -> TokenData:
    return verify_token(token.credentials)

def register_user(register_data: RegisterRequest, db: Session) -> RegisterResponse:
    try:
        # Check existing email
        existing_email = db.exec(select(Aluno).where(Aluno.email == register_data.email)).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
        
        # Check existing TIA
        existing_tia = db.exec(select(Aluno).where(Aluno.tia == register_data.tia)).first()
        if existing_tia:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="TIA já cadastrado"
            )
        
        # Hash the password
        hashed_password = get_password_hash(register_data.senha)
        
        # Create new aluno instance with current timestamp for updated_at
        aluno = Aluno(
            email=register_data.email,
            nome=register_data.nome,
            tia=register_data.tia,
            curso=register_data.curso,
            semestre=register_data.semestre,
            senha_hash=hashed_password,
            updated_at=datetime.now(timezone.utc)  # Set the initial updated_at timestamp
        )
        
        db.add(aluno)
        db.commit()
        db.refresh(aluno)
        
        # Create access token
        access_token = create_access_token(
            email=aluno.email,
            aluno_id=aluno.id
        )
        
        return RegisterResponse(
            access_token=access_token,
            token_type="bearer",
            aluno_id=aluno.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erro ao registrar usuário: {e}")
        raise HTTPException(status_code=500, detail="Erro ao registrar usuário")

def login_for_access_token(login_data: LoginRequest, db: Session = Depends(get_db)) -> Token:
    try:
        user = authenticate_user(login_data.email, login_data.senha, db)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        access_token = create_access_token(
            email=user.email,
            aluno_id=user.id,
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return Token(access_token=access_token, token_type="bearer")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erro no login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao realizar login"
        )
    


