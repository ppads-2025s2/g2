# Manual de Implantação - Sistema de Gerenciamento de Impressoras 3D e Corte a laser 

Este documento detalha o processo de preparação do ambiente, configuração e execução da aplicação utilizando Docker.

## 1. Pré-requisitos (Hardware e Software)

Para executar o projeto, o servidor ou máquina host deve atender aos seguintes requisitos:

### Hardware Recomendado
* **CPU:** 2 vCPUs ou superior.
* **RAM:** Mínimo de 4GB (Recomendado 8GB para build dos containers).
* **Armazenamento:** 20GB livres em disco.

### Software Necessário
* **Sistema Operacional:** Linux (Ubuntu 20.04+), Windows 10/11 (com WSL2) ou macOS.
* **Git:** Para clonagem do repositório.
* **Docker Engine:** Versão 20.10 ou superior.
* **Docker Compose:** Versão 1.29 ou superior (ou plugin docker compose v2).

## 2. Estrutura da Aplicação

A aplicação é conteinerizada e dividida em três serviços principais orquestrados pelo Docker Compose:

1.  **Backend (API):** Python (Flask/FastAPI/Django) expondo endpoints REST.
2.  **Frontend (Client):** React.js servido via Node server.
3.  **Database:** MariaDB para persistência de dados (usuários, agendamentos, logs).

## 3. Configuração de Variáveis de Ambiente

Antes de iniciar, é necessário configurar as variáveis de ambiente.

1.  Na raiz do projeto, duplique o arquivo `.env.example` e renomeie para `.env`.
2.  Edite o arquivo `.env` com as configurações de produção/desenvolvimento:

```bash
# Configuração do Banco de Dados (MariaDB)
DB_ROOT_PASSWORD=senha_super_secreta_root
DB_DATABASE=impressoras_db
DB_USER=app_user
DB_PASSWORD=senha_usuario_app
DB_HOST=db_service

# Backend Python
SECRET_KEY=sua_chave_criptografica_aqui
API_PORT=8000
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend React
REACT_APP_API_URL=http://localhost:8000

Procedimento de Instalação e Execução
Clonar repositório 
git clone [https://github.com/seu-grupo/gerenciador-impressao-3d.git](https://github.com/seu-grupo/sistema_gerenciamento.git)
cd  sistema_gerenciamento

Construir e Iniciar os Containers
o comando do Docker Compose para baixar as imagens, construir o código e subir os serviços.
# Para rodar em primeiro plano (ver logs no terminal)
docker-compose up --build

# Para rodar em background (modo detached)
docker-compose up -d --build

Migrações de Banco de Dados
é necessário criar as tabelas no MariaDB
docker-compose exec backend python manage.py migrate
# OU se usar Alembic/SQLAlchemy
docker-compose exec backend alembic upgrade head

Verificação de Funcionamento
Frontend: Acesse http://localhost:3000 (ou a porta configurada). A tela de login deve aparecer.
Backend: Acesse http://localhost:8000/health (ou /docs se usar Swagger) para verificar se a API responde.
Banco de Dados: Verifique se os logs do container db indicam "ready for connections".

Troubleshooting Comum
Erro de Conexão com Banco: Verifique se as credenciais no .env batem com as do docker-compose.yml
Porta em uso: Certifique-se que as portas 3000, 8000 e 3306 não estão ocupadas por outros serviços no host.
