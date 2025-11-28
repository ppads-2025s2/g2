#  Sistema de Gerenciamento de Impressoras 3D e Laser

Sistema desenvolvido para facilitar o agendamento e gerenciamento do uso de equipamentos (Impressoras 3D e Cortadoras a Laser) por alunos da universidade. O sistema valida regras de negócio baseadas no curso e semestre do aluno (ex: alunos de Arquitetura/Design).

## Funcionalidades

- **Autenticação de Usuários:** Login seguro para alunos e administradores.
- **Agendamento de Equipamentos:**
  - Reserva de horários para Impressora 3D.
  - Reserva de horários para Corte a Laser.
- **Regras de Negócio:** Validação de permissão baseada no curso e semestre do aluno.
- **Validação de TCC:** Endpoint específico para validar status de TCC.
- **Painel do Aluno:** Visualização de agendamentos futuros e histórico.

## Tecnologias Utilizadas

- **Frontend:** React.js
- **Backend:** Python (FastAPI)
- **Banco de Dados:** MariaDB
- **Infraestrutura:** Docker & Docker Compose

## Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Desktop instalados.
- Git instalado.

## Containers com Docker Compose:
docker-compose up --build

## cesso da aplicação:
rontend (Sistema): (http://localhost:5173/) (ou a porta que você configurou)

Documentação da API (Swagger): [http://localhost:8000/docs](http://127.0.0.1:8000/docs)

A API possui documentação automática via Swagger UI. Após rodar o projeto

Principais Endpoints:

POST /api/login: Autenticação.

POST /api/registrar: Cadastro de novos usuários.

GET /api/agendamentos/disponiveis: Verifica horários livres.

POST /api/agendamentos: Cria uma nova reserva.
