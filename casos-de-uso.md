<img width="1637" height="738" alt="diagrama_sistema" src="https://github.com/user-attachments/assets/3bf8801a-34cf-4676-a31c-bfbd87967818" />
Sistema de Agendamento FAU+D 
Atualização do Sistema de Agendamento das Cortadoras a Laser e criação do Sistema de Agendamento das Impressoras 3D para estudantes da FAU+D.

Parte 1 — Descrição dos Casos de Uso 
1) Atores
Aluno: estudante elegível (Arquitetura/Design; semestres conforme regras).
Aluno TFG: sub tipo de Aluno com janela prioritária específica.
Aluno 3º Semestre: sub tipo de Aluno com permissão (Laser) nas mesmas janelas de 4º–8º.
Laboratorista: operador do laboratório; valida arquivos, gerencia fila/horários.
Serviço de Notificação: componente que envia e mails automatizados.
Relógio/Agendador do Sistema: rotina que libera vagas e dispara lembretes.
2)Fluxo
Janela Prioritária (Laser): dias/turnos com prioridade por semestre. TFG: seg/ter/qui. 4º–8º (e 3º sem. de Arquitetura): qua/sex.
Horário (Laser): bloco fixo de tempo. Reserva permitida até o horário de início.
Fila (3D): ordem de atendimento sem horário fixo; cada peça tem tempo variável.
Status de Agendamento (3D): APTO, EXCEDE TEMPO, EXCEDE MÁQUINA, PROBLEMAS NO ARQUIVO, SEM MATERIAL.
Status de Impressão (3D): NA FILA, IMPRESSÃO INICIADA, IMPRESSÃO FINALIZADA.
Tempo de Impressão (3D): estimativa de duração desconsiderando madrugada e fins de semana.
Prazo de Início (3D): tempo restante de agendamentos anteriores até iniciar a impressão.

A. Cortadora a Laser
UC L0 — Autenticar Usuário
Ator: Aluno ou Laboratorista
Propósito: criar sessão autenticada.
Fluxo Normal: 1) Usuário informa credenciais → 2) Sistema valida → 3) Sessão criada.
Extensões: 1a) Credenciais inválidas → exibir erro e solicitar nova entrada.
UC L1 — Consultar Disponibilidade de Horários
Ator: Aluno
Pré condições: UC L0 concluído.
Fluxo Normal:
Aluno escolhe data e informa semestre.
Sistema aplica janelas prioritárias (TFG seg/ter/qui; 4º–8º/3º qua/sex).
Se a data é hoje, o sistema libera horários livres para todos os semestres (regra: “liberação no dia”).
Sistema retorna os blocos disponíveis (considerando conflitos do próprio aluno e reservas existentes).
Pós condições: Disponibilidade exibida conforme regras.
Extensões: 2a) Data fora do calendário do laboratório → informar indisponibilidade; 4a) Nenhum horário disponível → sugerir datas/turnos alternativos.
UC L2 — Agendar Cortadora a Laser
Ator: Aluno
Inclui: UC L0.
Pré condições: UC L1 executado; aluno elegível; bloco disponível.
Fluxo Normal:
Aluno seleciona bloco.
Sistema valida permissões por semestre e confirma que a reserva está até o horário de início (ex.: bloco 10:00 pode ser reservado às 10:00).
Sistema registra a reserva, associa o titular e opcionalmente solicita suplente.
Sistema envia e mail de confirmação e agenda um lembrete no dia do uso.
Sistema exibe comprovante com regras: cancelamento até 1h antes, inclusão de suplente mesmo após início e política de novo agendamento.
Pós condições: Reserva criada; lembrete programado.
Extensões: 2a) Tentativa fora da janela (antes do dia) → negar e explicar; 3a) Conflito com outra reserva do aluno → sugerir alteração.
UC L3 — Incluir Suplente
Ator: Aluno (titular)
Pré condições: Agendamento existente.
Fluxo Normal:
Titular informa TIA/E mail do suplente.
Sistema verifica elegibilidade do suplente (curso/semestre).
Sistema registra o suplente — mesmo após o início do horário.
Sistema notifica suplente e titular.
Extensões: 2a) Suplente inelegível → rejeitar e solicitar outro; 1a) Dados inválidos → solicitar correção.
UC L4 — Cancelar Agendamento — Laser
Ator: Aluno
Regras: permitido até 1h antes do início.
Fluxo Normal:
Aluno solicita cancelamento.
Sistema calcula diferença para o início do bloco.
Se ≥ 1h, sistema cancela, libera a vaga e notifica interessados (lista de espera/alerta geral) e o titular.
Pós condições: Vaga liberada no calendário.
Extensões: 3a) < 1h → negar cancelamento e orientar contato com laboratório.
UC L5 — Realizar Novo Agendamento após Concluir Uso
Ator: Aluno
Gatilho: término do bloco utilizado.
Fluxo Normal:
No encerramento, o sistema registra presença/conclusão (via check out do aluno ou confirmação do laboratorista).
Imediatamente após o registro, o sistema remove a restrição e permite novo agendamento.
Aluno realiza nova reserva via UC L2.
Extensões: 1a) Ausência de registro de conclusão → solicitar validação do laboratorista para liberar novo agendamento.
UC L6 — Liberar Horários no Dia para Outros Semestres (Automático)
Ator: Relógio/Agendador do Sistema
Fluxo Normal:
No início do expediente do dia, o sistema identifica horários livres.
Remove restrição de semestre para esses horários.
Atualiza a disponibilidade e (opcional) envia alerta geral de vagas do dia.
UC L7 — Enviar Notificação do Dia — Laser (Automático)
Ator: Serviço de Notificação
Gatilho: data da reserva = hoje.
Fluxo Normal:
Sistema gera segundo e mail com lembrete, orientações de uso e política de cancelamento.
Registra log do envio.

B. Impressoras 3D (baseado em Fila)
UC 3D0 — Autenticar Usuário
Idêntico ao UC L0.
UC 3D1 — Cadastrar Solicitação de Impressão
Ator: Aluno
Inclui: UC 3D0.
Pré condições: aluno elegível (curso/semestre); arquivo em formato aceito.
Fluxo Normal:
Aluno acessa painel 3D e lê o Campo Informativo (Manual) com orientações.
Preenche dados do trabalho e faz upload do(s) arquivo(s).
Informa Material: possui ou não filamento adequado.
Sistema cria solicitação na Fila com Status de Agendamento = pendente.
Sistema confirma recepção ao aluno.
Pós condições: Solicitação registrada para análise do laboratorista.
Extensões: 2a) Upload inválido/falho → solicitar novo arquivo; 3a) Sem material → registrar e sinalizar ao laboratorista para decisão.
UC 3D2 — Validar Arquivos e Definir Status de Agendamento
Ator: Laboratorista
Pré condições: UC 3D1 concluído.
Fluxo Normal:
Laboratorista acessa lista por ordem de aprovação.
Visualiza dados do aluno (TIA, Nome, Curso, E mail).
Faz download dos arquivos e realiza a checagem técnica.
Define Status de Agendamento:
APTO — segue para fila;
EXCEDE TEMPO — estimativa supera janelas operacionais;
EXCEDE MÁQUINA — dimensões/volume excedem a impressora;
PROBLEMAS NO ARQUIVO — malha, escala, formato etc.;
SEM MATERIAL — aluno não possui filamento adequado.
Sistema notifica automaticamente o aluno com o resultado e instruções.
Extensões: 4a) Reprovado → permanecer aguardando correção; novo upload reabre avaliação.
UC 3D3 — Estimar Tempo e Prazo de Início
Ator: Laboratorista
Pré condições: Solicitação APTA.
Fluxo Normal:
Laboratorista insere Tempo de Impressão estimado da peça.
Sistema calcula Prazo de Início, somando os tempos das peças à frente e desconsiderando madrugada/fins de semana (máquinas indisponíveis).
Sistema atualiza posição na fila e exibe previsão ao aluno e ao laboratorista.
Pós condições: Solicitação com previsão de início/duração visíveis.
UC 3D4 — Atualizar Status de Impressão
Ator: Laboratorista
Fluxo Normal:
Altera Status de Impressão: NA FILA → IMPRESSÃO INICIADA → IMPRESSÃO FINALIZADA.
A cada mudança, o sistema notifica o aluno.
Ao finalizar, registrar tempo real e eventuais ocorrências.
Extensões: 1a) Falha de impressão → voltar para NA FILA com observação e nova previsão.
UC 3D5 — Consultar Fila e Status (Aluno)
Ator: Aluno
Fluxo Normal:
Acessa painel do aluno.
Visualiza: Status de Agendamento, Status de Impressão, Tempo de Impressão, Prazo de Início, confirmação de Download realizado pelo laboratório e indicador de Material (tem/não tem).
Pode cancelar (UC 3D6) quando necessário.
UC 3D6 — Cancelar Solicitação — 3D
Ator: Aluno
Fluxo Normal:
Solicita cancelamento.
Se Status de Impressão = NA FILA, sistema remove da fila, recalcula prazos dos demais e notifica laboratorista e aluno.
Extensões: 2a) Se IMPRESSÃO INICIADA ou FINALIZADA → negar cancelamento e orientar contato presencial.
UC 3D7 — Manter Informações Administrativas (Interface do Laboratorista)
Ator: Laboratorista
Fluxo Normal:
Edita o Campo Informativo (manual/orientações para alunos).
Acompanha lista por ordem de aprovação e atualiza Status de Agendamento.
Qualquer atualização de Status (agendamento ou impressão) dispara notificação automática ao aluno.

C. Pré/Pós Condições Comuns e Notificações
Pré: usuário autenticado; elegibilidade automática por curso/semestre; aceite de termos do laboratório.
Pós: logs de auditoria para reservas, fila, notificações e presença.
Notificações:
Laser: e mail de confirmação no ato e lembrete no dia (UC L7).
3D: e mail a cada mudança de Status de Agendamento e Status de Impressão.

D. Rastreabilidade (Requisito → Caso de Uso)
Liberar no dia para outros semestres (Laser) → UC L1, UC L6.
Agendar até o início (Laser) → UC L2.
Incluir suplente após início (Laser) → UC L3.
Cancelar até 1h antes (Laser) → UC L4.
Novo agendamento logo após concluir (Laser) → UC L5.
Notificação no dia (Laser) → UC L7.
Incluir 3º semestre (Laser) → regras em Glossário e validações UC L1/L2.
3D baseado em fila; estimativas sem madrugada/fds → UC 3D1/3D3.
Dados do aluno para laboratorista (TIA/Nome/Curso/E mail) → UC 3D2.
Status de Agendamento (APTO/EXCEDE…/SEM MATERIAL) → UC 3D2.
Status de Impressão (NA FILA/INICIADA/FINALIZADA) → UC 3D4/3D5.
Download/Material/Cancelar (3D) → UC 3D1, UC 3D5, UC 3D6.
Notificações automáticas em atualizações (3D) → UC 3D2, UC 3D4, UC 3D7.
