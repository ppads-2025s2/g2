from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database.database import get_db
from auth.models import Token
from auth.service import verificar_senha, criar_access_token
from alunos.service import service_get_usuario_por_email

router = APIRouter()

@router.post("/login", response_model=Token)
def login_para_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Endpoint de login.
    O frontend deve enviar 'username' (email) e 'password'.
    """
    
    usuario = service_get_usuario_por_email(db, email=form_data.username)
    
    # Verifica se o usuário existe e se a senha está correta
    if not usuario or not verificar_senha(form_data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Cria o token (JWT)
    access_token = criar_access_token(data={"sub": usuario.email})
    return {"access_token": access_token, "token_type": "bearer"}