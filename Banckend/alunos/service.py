from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from entities.alunos import Usuario, CursoEnum
from alunos.models import UsuarioCreate
import pandas as pd
from fastapi import UploadFile
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

async def service_validar_tcc(db: Session, usuario_id: int, arquivo: UploadFile):
    # 1. Validação básica de arquivo
    if not arquivo.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Apenas arquivos .csv são aceitos")

    try:
        # 2. Ler o CSV
        df = pd.read_csv(arquivo.file)
        
        # Normalizar colunas (tudo minúsculo e sem espaços)
        df.columns = [c.lower().strip() for c in df.columns]

        # Verificar colunas obrigatórias
        if 'curso' not in df.columns or 'semestre' not in df.columns:
            raise HTTPException(status_code=400, detail="CSV deve ter colunas: 'curso' e 'semestre'")

        # Pegar dados da primeira linha
        dados = df.iloc[0]
        curso_csv = str(dados['curso']).lower()
        semestre_csv = int(dados['semestre'])

        # 3. Validar Regras de TCC
        # Cursos permitidos (verificamos se o nome contém a palavra chave)
        cursos_tcc = ['arquitetura', 'design', 'sistemas de informação', 'sistema de informação']
        eh_curso_valido = any(c in curso_csv for c in cursos_tcc)

        if not eh_curso_valido:
            raise HTTPException(status_code=400, detail=f"O curso '{dados['curso']}' não é elegível para TCC no Lab.")

        # Semestres permitidos: 7, 8, 9, 10
        if semestre_csv < 7:
            raise HTTPException(status_code=400, detail=f"TCC liberado apenas a partir do 7º semestre. Seu semestre: {semestre_csv}")

        # 4. Atualizar o Usuário no Banco
        usuario = service_get_usuario_por_id(db, usuario_id)
        usuario.eh_aluno_tcc = True
        # Opcional: Se quiser atualizar o semestre do aluno com o dado do CSV:
        usuario.semestre = semestre_csv 
        
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        
        return {"message": "Validação de TCC concluída com sucesso!", "eh_aluno_tcc": True}

    except ValueError:
        raise HTTPException(status_code=400, detail="O campo 'semestre' no CSV deve ser um número.")
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Erro no processamento CSV: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar o arquivo.")