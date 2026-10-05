from pydantic import BaseModel
from datetime import datetime
from entities.agendamentos import MaquinaEnum
from alunos.models import UsuarioPublic # Reutiliza o schema de aluno

# Schema para CRIAR um agendamento
class AgendamentoCreate(BaseModel):
    tipo_maquina: MaquinaEnum
    data_inicio: datetime
    duracao_horas: int # Usuário vai pedir 1 ou 2 horas

# Schema de RESPOSTA do agendamento
class AgendamentoPublic(BaseModel):
    id: int
    tipo_maquina: MaquinaEnum
    data_inicio: datetime
    data_fim: datetime
    usuario: UsuarioPublic # Mostra quem agendou

    class Config:
        from_attributes = True


# Schema para atualizar um agendamento (todos opcionais)
class AgendamentoUpdate(BaseModel):
    tipo_maquina: MaquinaEnum | None = None
    data_inicio: datetime | None = None
    duracao_horas: int | None = None