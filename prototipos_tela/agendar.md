# Agendar Cortadora a Laser (UC L2)
Legenda: Layout mobile com nome do aluno, seletor de data/horário, campo de suplente e ação principal *Confirmar Reserva*. 

## Objetivo da tela
- Viabilizar que o *Aluno* escolha um *bloco de horário* disponível e finalize a reserva.
- Aplicar automaticamente as *janelas prioritárias* por semestre e a *liberação no dia* (quando aplicável).
- Oferecer inclusão *opcional* de *Suplente (TIA/E-mail)* antes da confirmação.

## Pré-condições
- Aluno autenticado (UC L0).
- Elegibilidade validada (curso/semestre).
- Disponibilidade consultada (UC L1) *ou* carregada nesta tela ao selecionar a *Data*.

## Componentes da UI
1. *Título:* “Agendar Cortadora a Laser”.
2. *Nome do Aluno:* exibição do nome logado (ex.: Ana Oliveira).
3. *Data (calendário compacto):* limita datas ao calendário do laboratório.
4. *Bloco de Horário (chips/botões):* ex.: 08:00–09:00, 10:00–11:00, 13:00–14:00.  
   - Estados: *disponível, **indisponível, **selecionado*.
5. *Incluir Suplente (opcional):* campo de *TIA/E-mail* com validação básica.
6. *Botão principal:* *Confirmar Reserva* (ativa regras e gravação).
7. *Rodapé (regras):* “Cancelamento até 1h antes • Suplente pode ser incluído após início • Novo agendamento após concluir uso”.

## Fluxo principal (happy path)
1. Aluno escolhe *Data* → sistema aplica janelas por semestre e *liberação no dia*, retornando blocos disponíveis.
2. Aluno seleciona *Bloco de Horário*.
3. (Opcional) Preenche *Suplente* (TIA/E-mail).
4. Toca em *Confirmar Reserva* → sistema valida:
   - Elegibilidade do aluno e *permissão por semestre*.
   - *Regra “até o horário de início”* (pode reservar às 10:00 para bloco 10:00).
   - Conflito com outras reservas do aluno.
5. Sistema *registra a reserva, **envia e-mail* e *agenda lembrete* no dia do uso.
6. Exibe *mensagem de sucesso* (comprovante acessível).

## Regras de negócio aplicadas (Laser)
- *Janelas prioritárias*:
  - *TFG:* seg/ter/qui.
  - *4º–8º + 3º (Arq):* qua/sex.
- *Liberação no dia:* se *Data = hoje*, horários livres são liberados para todos os semestres.
- *Reserva até o início:* permitido reservar *até o horário de início do bloco*.
- *Suplente:* pode ser *incluído depois* do início (UC L3).
- *Cancelamento:* permitido até *1h antes* (UC L4).
- *Novo agendamento:* liberado *logo após concluir* o uso (UC L5).

## Mensagens e estados
- *Sucesso:* “Reserva confirmada. Enviamos e-mail com detalhes e lembrete.”
- *Tentativa fora da janela:* “Este horário é prioritário para outro semestre. Tente outra data/turno.”
- *Sem vagas:* “Nenhum horário disponível na data. Ver opções alternativas.”
- *Conflito:* “Você já tem uma reserva que conflita com este horário.”
- *Dados do suplente inválidos:* “Informe um TIA ou e-mail válido.”

## Validações
- *Nome do aluno:* exibido a partir da sessão.
- *Data:* apenas dias úteis e dentro do calendário do lab.
- *Horário:* deve estar *disponível* e respeitar janela/semestre.
- *Suplente (opcional):* formato *TIA* (numérico) ou *e-mail* válido.

## Acessibilidade e usabilidade
- Alvos de toque ≥ *44px*; contraste adequado.
- Feedback de *estado selecionado* nos chips de horário.
- Mensagens de erro claras, *em linha*.
- Suporte a *teclado numérico* para TIA e *@* facilitado para e-mail.

## Rastreabilidade (UC ↔ Tela)
- *UC L2 — Agendar Cortadora a Laser:* fluxo principal desta tela.
- *UC L1:* consulta de disponibilidade embutida (data/semestre/regras).
- *UC L7:* lembrete no dia (disparado após a confirmação).
- *UC L3/L4/L5:* menções nas regras e continuidade do processo.
![WhatsApp Image 2025-09-16 at 20 41 52](https://github.com/user-attachments/assets/7339a408-9233-4fae-9ac8-501d854ab8f4)


