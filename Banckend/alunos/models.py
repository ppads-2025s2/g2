from pydantic import BaseModel, EmailStr, validator
from entities.alunos import CursoEnum

# Schema para o CADASTRO (o que o frontend envia)
class UsuarioCreate(BaseModel):
    email: EmailStr
    password: str
    curso: CursoEnum
    semestre: int

# Schema de RESPOSTA (o que a API devolve, sem a senha)
class UsuarioPublic(BaseModel):
    id: int
    email: EmailStr
    curso: CursoEnum
    semestre: int

    class Config:
        orm_mode = True # Converte o modelo SQLAlchemy para Pydantic


# Schema para atualizações (todos opcionais)
class UsuarioUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = None
    curso: CursoEnum | None = None
    semestre: int | None = None