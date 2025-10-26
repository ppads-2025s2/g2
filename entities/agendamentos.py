from datetime import datetime
from sqlmodel import SQLModel, Field

class Agendamento(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    aluno_id: int = Field(foreign_key="aluno.id", index=True)
    data_inicio: datetime
    data_fim: datetime
    horas_necessarias: int = 1
    status: str = Field(default="pendente", max_length=20)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = Field(default=None, nullable=True)