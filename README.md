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
- Node.js 18+ instalado.
- Git instalado.

### 1. Configurar o backend
Dentro da pasta `Banckend`, copie o `.env.example` para `.env` e ajuste a `SECRET_KEY`.

### 2. Subir o banco de dados e a API (Docker Compose)
```bash
cd Banckend
docker-compose up --build
```

### 3. Rodar o frontend
Em outro terminal:
```bash
cd Frontend
npm install
npm run dev
```

Mais detalhes em [docs/manual-implantacao.md](docs/manual-implantacao.md).

## Acesso da aplicação
- **Frontend (Sistema):** [http://localhost:5173](http://localhost:5173)
- **Documentação da API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

## Principais Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/login` | Autenticação (retorna token JWT) |
| POST | `/api/registrar` | Cadastro de novos usuários |
| GET | `/api/usuarios/eu` | Dados do usuário logado |
| POST | `/api/validar-tcc` | Envio do CSV de comprovação de TCC |
| GET | `/api/agendamentos/disponiveis?tipo_maquina=` | Horários livres para a máquina (`impressora_3d` ou `laser`) |
| POST | `/api/agendamentos` | Cria uma nova reserva |
| GET | `/api/meus_agendamentos` | Reservas do usuário logado |
| DELETE | `/api/agendamentos/{id}` | Cancela uma reserva |
