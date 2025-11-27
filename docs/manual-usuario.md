# Manual do Usuário - Sistema de Agendamento 3D e Corte a Laser

Bem-vindo ao manual do usuário do sistema de agendamento de máquinas do laboratório. Este documento orienta alunos de **Design** e **Arquitetura e Urbanismo** sobre como reservar horários e administradores sobre como validar essas reservas.

## 1. Acesso ao Sistema

O sistema é baseado em interface web:
1. Abra seu navegador.
2. Acesse o endereço do servidor (Ex: `http://localhost:3000`).

---

## 2. Perfil: Aluno

Este perfil é exclusivo para alunos matriculados nos cursos de Design e Arquitetura e Urbanismo.

### 2.1 Cadastro e Login
1. Clique em **"Criar Conta"**.
2. Preencha: Nome completo, Matrícula e E-mail institucional.
3. Defina sua senha.
4. Clique em **"Cadastrar"**.

### 2.2 Regras de Agendamento (Prioridades)
O sistema libera os dias da semana automaticamente baseando-se no seu semestre e vínculo com TCC:

| Perfil do Aluno | Semestre | Dias Disponíveis para Agendamento |
| :--- | :--- | :--- |
| **Prioridade Máxima** | 10º Semestre | Todos os dias (Segunda a Sexta) |
| **Alunos de TCC** | 7º, 8º e 9º Semestres | Quartas e Sextas-feiras |
| **Demais Alunos** | Outros semestres | Segundas, Terças e Sextas-feiras |

### 2.3 Realizando um Agendamento
Para reservar uma máquina (Impressora 3D ou Cortadora a Laser):

1. No menu lateral, clique em **"Novo Agendamento"**.
2. **Comprovação de TCC (Se aplicável):**
   - Caso você esteja nos semestres de TCC (7º, 8º ou 9º), é obrigatório fazer o upload do comprovante.
   - Arraste ou selecione o arquivo no formato **.csv** no campo indicado.
3. **Seleção de Horário:**
   - O calendário mostrará apenas os dias permitidos para o seu perfil.
   - Selecione o dia desejado.
   - Escolha a duração do uso: **1 hora** ou **2 horas**.
4. Clique em **"Confirmar Agendamento"**.

### 2.4 Acompanhamento e Histórico
Acesse **"Meus Agendamentos"** para ver o status e o histórico de suas reservas:

- **Pendente:** O agendamento foi realizado, mas aguarda a verificação do comprovante de TCC pelo monitor (para alunos de 7º a 9º semestre).
- **Confirmado:** Seu horário está garantido. Compareça ao laboratório com antecedência.
- **Concluído:** O horário agendado já passou e o uso foi registrado no histórico.
- **Cancelamento:** O horário agendado foi cancelado.
---

### 3 Validação de Agendamentos (TCC)
Alunos do 7º ao 9º semestre precisam ter seus comprovantes validados para confirmar a reserva na Quarta ou Sexta.

1. Acesse o menu **"Solicitações Pendentes"**.
2. Identifique o agendamento na lista.
3. **Verificação:**
   - Baixe o arquivo `.csv` enviado pelo aluno.
   - Confira se o aluno está devidamente matriculado na disciplina de TCC.
4. **Ação:**
   - **Aprovar:** O agendamento muda para "Confirmado" e o aluno é notificado.
   - **Cancelar:** O horário volta a ficar livre.
     

### 3.1 Relatórios
O sistema mantém o histórico completo para consulta em **"Relatórios"**:
- Quantidade de agendamentos por aluno.
- Horas totais de uso das máquinas.
- Listagem de alunos de TCC que utilizaram o laboratório.

---

## 4. Suporte

Caso encontre erros no sistema ou tenha problemas com seu cadastro:
- **Horário de Atendimento:** Segunda a Sexta, das 08h às 18h.

---
*Documentação do Sistema de Agendamento - Versão 1.0*
