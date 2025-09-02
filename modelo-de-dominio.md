@startuml
title Modelo de Domínio – Sistema de Agendamento FAU+D

class Aluno {
  +tia: String
  +nome: String
  +curso: String
  +semestre: int
  +email: String
}

class AlunoTFG
class Aluno3Semestre

AlunoTFG --|> Aluno
Aluno3Semestre --|> Aluno

class Laboratorista {
  +id: String
  +nome: String
  +email: String
}

class AgendamentoLaser {
  +id: String
  +dataCriacao: DateTime
  +status: String
  +cancelavelAte: DateTime
  +foiConcluido: boolean
}

class BlocoHorario {
  +id: String
  +data: Date
  +inicio: Time
  +fim: Time
  +turno: String
}

class ReservaParticipacao {
  +tipo: String   ' TITULAR / SUPLENTE
}

AgendamentoLaser *-- BlocoHorario
AgendamentoLaser "1..2" o-- "1..2" ReservaParticipacao
ReservaParticipacao "1" --> "1" Aluno : aluno

class JanelaPrioritaria {
  +id: String
  +grupoSemestre: String
  +diasSemana: String
}
BlocoHorario --> JanelaPrioritaria : éRegidoPor

class LogAuditoria {
  +id: String
  +momento: DateTime
  +tipo: String
  +descricao: String
}
AgendamentoLaser "0..*" --> LogAuditoria

class Notificacao {
  +id: String
  +tipo: String
  +destinatario: String
  +enviadaEm: DateTime
  +conteudo: String
}
AgendamentoLaser "0..*" --> Notificacao
SolicitacaoImpressao "0..*" --> Notificacao

' ---------- FILA 3D ----------
class SolicitacaoImpressao {
  +id: String
  +dataCriacao: DateTime
  +statusAgendamento: String
  +statusImpressao: String
  +tempoEstimadoMin: int
  +prazoInicioPrevisto: DateTime
  +tempoRealMin: int
  +observacoes: String
  +possuiMaterial: boolean
  +tipoFilamento: String
}

class ArquivoTrabalho {
  +id: String
  +nome: String
  +formato: String
  +tamanhoMB: float
  +validado: boolean
}
SolicitacaoImpressao "1..*" *-- ArquivoTrabalho
SolicitacaoImpressao "1" --> "1" Aluno : solicitante
SolicitacaoImpressao "0..1" --> Laboratorista : validadoPor

class FilaImpressao {
  +id: String
  +nome: String
  +recalcularPrazos(): void
}
FilaImpressao "1" o-- "0..*" SolicitacaoImpressao : ordena >>

class ServicoNotificacao <<domain service>> {
  +enviarNotificacao(n: Notificacao)
}
class AgendadorDoSistema <<domain service>> {
  +liberarHorariosDoDia()
  +agendarLembrete(ag: AgendamentoLaser, quando: DateTime)
  +calcularPrazoInicio(fila: FilaImpressao)
}
class PoliticasLaboratorio <<domain service>> {
  +podeReservar(aluno: Aluno, bloco: BlocoHorario, agora: DateTime): boolean
  +podeCancelar(ag: AgendamentoLaser, agora: DateTime): boolean
  +liberacaoNoDia(bloco: BlocoHorario): boolean
  +desconsiderarMadrugadaEFinaisDeSemana(): void
}
ServicoNotificacao ..> Notificacao
AgendadorDoSistema ..> BlocoHorario
AgendadorDoSistema ..> FilaImpressao
PoliticasLaboratorio ..> JanelaPrioritaria
PoliticasLaboratorio ..> Aluno
PoliticasLaboratorio ..> AgendamentoLaser


note right of JanelaPrioritaria
TFG: Seg/Ter/Qui
4º–8º (+ 3º Arq.): Qua/Sex
"Liberação no dia": horários livres
ficam sem restrição de semestre.
end note

note bottom of AgendamentoLaser
Reserva permitida até o início do bloco.
Cancelamento permitido até 1h antes.
Suplente pode ser incluído mesmo após o início.
Novo agendamento liberado após a conclusão registrada.
end note

note bottom of SolicitacaoImpressao
Estimativa e prazo de início desconsideram
madrugada e fins de semana (máquinas indisponíveis).
Cancelamento só se status = NA_FILA.
end note
@enduml
