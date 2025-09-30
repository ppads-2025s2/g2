# Plano de Testes — UCXX: Configurar Perfil, Notificações e Segurança

## 1. Objetivo
Validar a página *Configurações* garantindo que:
- Dados pessoais sejam editáveis (exceto TIA).
- Preferências de notificação sejam alternadas e persistidas no estado.
- Alteração de senha respeite regras (tamanho mínimo, confirmação).
- Comportamentos de UI (ex.: exibir/ocultar senha, botões desabilitados) ocorram conforme o esperado.
- Feedbacks (alerts) apareçam corretamente em sucesso/erro (simulação de API).

## 2. Regras de Negócio (RB)
- *RB1*: TIA é imutável (campo desabilitado).
- *RB2*: Alteração de senha requer os 3 campos preenchidos.
- *RB3: Nova senha deve ter *≥ 6** caracteres.
- *RB4: Nova senha e confirmação devem **coincidir*.
- *RB5: Ao salvar perfil com dados válidos, exibir mensagem “Perfil atualizado com sucesso!*”.
- *RB6: Ao alterar senha com dados válidos, limpar os três campos e exibir “Senha alterada com sucesso!*”.
- *RB7*: Botão “Alterar Senha” fica desabilitado se qualquer dos 3 campos estiver vazio.
- *RB8*: Alternar “mostrar/ocultar” senha deve refletir imediatamente no tipo do input.

## 3. Cenários de Teste

| ID      | Título                                                    | Prioridade | Regras           |
|---------|-----------------------------------------------------------|------------|------------------|
| CT-001  | Salvar perfil com sucesso                                 | Alta       | RB5              |
| CT-002  | Impedir edição do TIA                                     | Alta       | RB1              |
| CT-003  | Alternar preferências de notificação                      | Média      | —                |
| CT-004  | Exibir/Ocultar senha (toggle de visibilidade)             | Média      | RB8              |
| CT-005  | Alterar senha com sucesso                                 | Alta       | RB2, RB3, RB4,RB6|
| CT-006  | Bloquear alteração: senhas diferentes                     | Alta       | RB4              |
| CT-007  | Bloquear alteração: nova senha com < 6 caracteres         | Alta       | RB3              |
| CT-008  | Botão “Alterar Senha” desabilitado com campos incompletos | Alta       | RB7              |
| CT-009  | E-mail inválido no perfil (validação do navegador)        | Média      | —                |
| CT-010  | Estado após salvar: manter alterações em tela             | Média      | —                |

---

## 4. Scripts de Teste

### CT-001 — Salvar perfil com sucesso
*Preparação:*
- Usuário autenticado, tela *Configurações* aberta.
- Valores iniciais:  
  name="João Silva", email="joao.silva@uni.br", tia="12345678", semester="8º", course="Ciência da Computação".

*Passos:*
1. No campo *Nome Completo*, digite: João Pedro Silva.
2. No campo *Email Institucional*, digite: joao.pedro@uni.br.
3. No campo *Semestre*, digite: 9º.
4. No campo *Curso*, digite: Engenharia de Software.
5. Clique em *Salvar Alterações*.

*Resultado Esperado:*
- Botão exibe “*Salvando...*” e depois retorna ao normal.
- Exibe *alert* “*Perfil atualizado com sucesso!*”.
- Campos permanecem com os novos valores.

---

### CT-002 — Impedir edição do TIA
*Preparação:*
- Tela *Configurações* aberta com *TIA = 12345678*.

*Passos:*
1. Tentar editar o campo *TIA*.

*Resultado Esperado:*
- Campo permanece *desabilitado*.

---

### CT-003 — Alternar preferências de notificação
*Preparação:*
- Estado inicial: todos os switches em true.

*Passos:*
1. Desmarcar todos os switches.
2. Marcar novamente *Confirmação de Reserva* e *Lembretes*.

*Resultado Esperado:*
- Switches refletem as mudanças corretamente.

---

### CT-004 — Exibir/Ocultar senha
*Preparação:*
- Campos de senha vazios.

*Passos:*
1. Em *Senha Atual*, digite: Senha@123.
2. Clique no ícone de olho → senha visível.
3. Clique novamente → senha oculta.

*Resultado Esperado:*
- Input alterna entre *text* e *password*.

---

### CT-005 — Alterar senha com sucesso
*Preparação:*
- Campos vazios.

*Passos:*
1. *Senha Atual*: Senha@123.
2. *Nova Senha*: NovaSenha#2025.
3. *Confirmar Nova Senha*: NovaSenha#2025.
4. Clique em *Alterar Senha*.

*Resultado Esperado:*
- Botão mostra “*Alterando...*” e depois normaliza.
- Exibe *alert* “*Senha alterada com sucesso!*”.
- Campos de senha ficam *limpos*.

---

### CT-006 — Bloquear alteração: senhas diferentes
*Passos:*
1. *Senha Atual*: Senha@123.
2. *Nova Senha*: Nova#2025.
3. *Confirmar Nova Senha*: Nova#2026.
4. Clique em *Alterar Senha*.

*Resultado Esperado:*
- Exibe *alert* “*As senhas não coincidem!*”.
- Campos permanecem preenchidos.

---

### CT-007 — Bloquear alteração: nova senha curta
*Passos:*
1. *Senha Atual*: Senha@123.
2. *Nova Senha*: 12345.
3. *Confirmar Nova Senha*: 12345.
4. Clique em *Alterar Senha*.

*Resultado Esperado:*
- Exibe *alert* “*A nova senha deve ter pelo menos 6 caracteres!*”.

---

### CT-008 — Botão desabilitado com campos incompletos
*Passos:*
1. Preencher apenas um ou dois campos de senha.
2. Verificar o botão *Alterar Senha*.

*Resultado Esperado:*
- Botão continua *desabilitado*.

---

### CT-009 — E-mail inválido
*Passos:*
1. Digitar joao.pedro no campo de email.
2. Clicar em *Salvar Alterações*.

*Resultado Esperado:*
- Navegador exibe validação nativa para formato inválido.
- Nenhum alert de sucesso aparece.

---

### CT-010 — Estado após salvar
*Preparação:*
- Alterar dados como no CT-001.

*Passos:*
1. Salvar e verificar valores na tela.

*Resultado Esperado:*
- Campos exibem os valores salvos, não retornam ao padrão.

---

## 5. Evidências
- Prints dos alerts (CT-001, CT-005, CT-006, CT-007).
- GIF do toggle de senha (CT-004).
- Observação do comportamento nativo no e-mail inválido (CT-009).
