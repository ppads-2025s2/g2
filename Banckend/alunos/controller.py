from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from database.database import get_db
from alunos.models import UsuarioCreate, UsuarioPublic, UsuarioUpdate
from alunos.service import (
    service_registrar_usuario,
    service_listar_usuarios,
    service_get_usuario_por_id,
    service_atualizar_usuario,
    service_deletar_usuario,
)
from auth.service import get_usuario_logado # Importa a dependência
from entities.alunos import Usuario

router = APIRouter()

@router.post("/registrar", response_model=UsuarioPublic, status_code=status.HTTP_201_CREATED)
def registrar_usuario(
    usuario_data: UsuarioCreate, 
    db: Session = Depends(get_db)
):
    """
    Endpoint para registrar um novo usuário (aluno).
    Aplica as regras de semestre e curso.
    """
    try:
        novo_usuario = service_registrar_usuario(db, usuario_data)
        return novo_usuario
    except HTTPException as e:
        raise e # Repassa a exceção (ex: "E-mail já cadastrado")
    except Exception as e:
        # Captura erros inesperados
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")

@router.get("/usuarios/eu", response_model=UsuarioPublic)
def ler_usuario_logado(usuario: Usuario = Depends(get_usuario_logado)):
    """
    Endpoint protegido que retorna os dados do usuário
    atualmente logado (com base no token).
    """
    return usuario


@router.get("/usuarios", response_model=list[UsuarioPublic])
def listar_usuarios(db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    """Lista todos os usuários (protegido)."""
    return service_listar_usuarios(db)


@router.get("/usuarios/{usuario_id}", response_model=UsuarioPublic)
def obter_usuario(usuario_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    u = service_get_usuario_por_id(db, usuario_id)
    if not u:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return u


@router.put("/usuarios/{usuario_id}", response_model=UsuarioPublic)
def atualizar_usuario(usuario_id: int, update: UsuarioUpdate, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    # Só permite que o próprio usuário atualize seus dados
    if usuario.id != usuario_id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    updated = service_atualizar_usuario(db, usuario_id, update.model_dump())
    return updated


@router.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_logado)):
    if usuario.id != usuario_id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    service_deletar_usuario(db, usuario_id)
    return {"detail": "Usuário deletado"}

@router.post("/validar-tcc")
async def validar_tcc_endpoint(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    usuario: Usuario = Depends(get_usuario_logado)
):
    """
    Recebe um CSV, verifica se é aluno de TCC (7º semestre+) 
    e libera o acesso especial.
    """
    # Importar a nova função do service (se não tiver importado no topo)
    from alunos.service import service_validar_tcc
    
    return await service_validar_tcc(db, usuario.id, file)