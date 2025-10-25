from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import validator

class AgendamentoBase(SQLModel):
    data_inicio: datetime = Field(
        ..., 
        description="Data e hora de início do agendamento",
        example="2025-09-10T09:00:00"
    )
    data_fim: datetime = Field(
        ...,
        description="Data e hora de término do agendamento",
        example="2025-09-10T10:00:00"
    )
    aluno_id: int = Field(foreign_key="aluno.id")
    horas_necessarias: int = Field(default=1)

    @validator("data_fim")
    def validar_horario(cls, v, values):
        if 'data_inicio' in values and v <= values['data_inicio']:
            raise ValueError("Data de término deve ser posterior à data de início")
        return v

    class Config:
        schema_extra = {
            "example": {
                "data_inicio": "2025-09-10T09:00:00",
                "data_fim": "2025-09-10T10:00:00",
                "aluno_id": 1,
                "horas_necessarias": 1
            }
        }

class Agendamento(AgendamentoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status: str = Field(default="pendente")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None, nullable=True)

class AgendamentoCreate(AgendamentoBase):
    pass

class AgendamentoRead(AgendamentoBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime]

class AgendamentoUpdate(SQLModel):
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    horas_necessarias: Optional[int] = None
    status: Optional[str] = None
