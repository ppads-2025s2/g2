from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date, time, datetime
from enum import Enum

class StatusAgendamento(str, Enum):
    PENDENTE = 1 
    CONFIRMADO = 2
    EM_ANDAMENTO = 3
    CONCLUIDO = 4
    CANCELADO = 5

class AgendamentoBase(SQLModel):
    id: int = Field(default=None, primary_key=True)
    aluno_id: int = Field(nullable=False)
    data: date
    hora_inicio: time
    hora_fim: time
    status: Optional[StatusAgendamento] = Field(default=StatusAgendamento.PENDENTE)

