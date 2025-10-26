from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import validator

class AgendamentoBase(SQLModel):
    data_inicio: datetime
    data_fim: datetime
    aluno_id: int
    horas_necessarias: int = 1

    @validator("data_fim")
    def validar_horario(cls, v, values):
        if "data_inicio" in values and v <= values["data_inicio"]:
            raise ValueError("Data de término deve ser posterior à data de início")
        return v

class AgendamentoCreate(AgendamentoBase):
    pass

class AgendamentoRead(AgendamentoBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    # pydantic v2:
    model_config = {"from_attributes": True}

class AgendamentoUpdate(SQLModel):
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    horas_necessarias: Optional[int] = None
    status: Optional[str] = None