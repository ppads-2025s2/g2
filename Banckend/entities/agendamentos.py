from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DATETIME
from database.database import Base
from entities.alunos import Usuario # Importa para a Foreign Key
import enum

# Enum para as máquinas
class MaquinaEnum(str, enum.Enum):
    impressora_3d = "impressora_3d"
    laser = "laser"

class Agendamento(Base):
    __tablename__ = "agendamentos" # Nome da tabela no MariaDB

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id")) # Chave estrangeira
    tipo_maquina = Column(Enum(MaquinaEnum), nullable=False)
    data_inicio = Column(DATETIME, nullable=False)
    data_fim = Column(DATETIME, nullable=False)

    # Relacionamento: Cada agendamento pertence a um usuário
    usuario = relationship("Usuario", back_populates="agendamentos")