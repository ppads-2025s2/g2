from sqlalchemy import Column, Integer, String, Enum, ForeignKey,Boolean
from sqlalchemy.orm import relationship
from database.database import Base
import enum

# Enum para os cursos (como a barra de escolha que você pediu)
class CursoEnum(str, enum.Enum):
    design = "design"
    arquitetura = "arquitetura"
    sistemas_info = "sistemas_info"

class Usuario(Base):
    __tablename__ = "usuarios" # Nome da tabela no MariaDB

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    curso = Column(Enum(CursoEnum), nullable=False)
    semestre = Column(Integer, nullable=False)
    eh_aluno_tcc = Column(Boolean, default=False)

    # Relacionamento: Um usuário pode ter vários agendamentos
    agendamentos = relationship("Agendamento", back_populates="usuario")