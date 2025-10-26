from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel
from pydantic import field_validator  # Pydantic v2

# Campos usados para leitura (o que existe no banco)
class AgendamentoBase(SQLModel):
    data_inicio: datetime
    data_fim: datetime
    aluno_id: int
    horas_necessarias: int = 1

    @field_validator("data_fim")
    @classmethod
    def validar_horario(cls, v, info):
        data_inicio = info.data.get("data_inicio")
        if data_inicio and v <= data_inicio:
            raise ValueError("Data de término deve ser posterior à data de início")
        return v

# Para criar: somente horas_necessarias (o service define horários conforme regras)
class AgendamentoCreate(SQLModel):
    horas_necessarias: int = 1

class AgendamentoRead(AgendamentoBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class AgendamentoUpdate(SQLModel):
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    horas_necessarias: Optional[int] = None
    status: Optional[str] = None
