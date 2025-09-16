## Novo Agendamento (Regra UC L5)

- *Condição:* Aluno só pode criar uma nova reserva se:
  - Não possui outra reserva ativa *OU*
  - Já concluiu o uso da reserva anterior.

### Fluxo
1. Sistema verifica se existe reserva ativa.
2. Se *não houver* → permitir novo agendamento.
3. Se *houver, checar se está **concluída*:
   - Concluída → permitir novo agendamento.
   - Não concluída → bloquear agendamento, exibir mensagem.

### Mensagem
- *Bloqueio:* “Novo agendamento liberado somente após concluir o uso atual.”

  ![WhatsApp Image 2025-09-16 at 20 59 33](https://github.com/user-attachments/assets/86acfe93-4af3-47ed-80cb-4435252e4eb0)

