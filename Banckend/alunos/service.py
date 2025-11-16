from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from entities.alunos import Usuario, CursoEnum
from alunos.models import UsuarioCreate
# Import de função de hash feito dentro da função para evitar import circular

def service_registrar_usuario(db: Session, usuario_data: UsuarioCreate):
    # 1. Verifica se o e-mail já existe
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario_data.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    # 2. APLICA AS REGRAS DE CADASTRO QUE VOCÊ PEDIU
    curso = usuario_data.curso
    semestre = usuario_data.semestre

    if curso in (CursoEnum.design, CursoEnum.arquitetura):
        if semestre < 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Alunos de Design ou Arquitetura só podem se cadastrar a partir do 3º semestre."
            )
    
    if curso == CursoEnum.sistemas_info:
        if not (1 <= semestre <= 8):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Alunos de Sistemas de Informação devem estar entre o 1º e 8º semestre."
            )

    # 3. Se passou nas regras, cria o usuário
    # Import local para evitar import circular com auth.service
    from auth.service import get_hash_senha
    hashed_password = get_hash_senha(usuario_data.password)
    
    novo_usuario = Usuario(
        email=usuario_data.email,
        password_hash=hashed_password,
        curso=usuario_data.curso,
        semestre=usuario_data.semestre
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

def service_get_usuario_por_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()


def service_listar_usuarios(db: Session):
    return db.query(Usuario).all()


def service_get_usuario_por_id(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()


def service_atualizar_usuario(db: Session, usuario_id: int, update_data: dict):
    usuario = service_get_usuario_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Se houver senha para atualizar, hash
    if "password" in update_data and update_data["password"]:
        from auth.service import get_hash_senha
        usuario.password_hash = get_hash_senha(update_data["password"])

    # Atualiza campos permitidos
    if "email" in update_data and update_data["email"]:
        usuario.email = update_data["email"]
    if "curso" in update_data and update_data["curso"]:
        usuario.curso = update_data["curso"]
    if "semestre" in update_data and update_data["semestre"] is not None:
        usuario.semestre = update_data["semestre"]

    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def service_deletar_usuario(db: Session, usuario_id: int):
    usuario = service_get_usuario_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(usuario)
    db.commit()
    return True