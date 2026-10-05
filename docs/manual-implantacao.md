# Manual de Implantação - Sistema de Gerenciamento de Impressoras 3D e Corte a laser 

Este documento detalha o processo de preparação do ambiente, configuração e execução da aplicação.

## 1. Pré-requisitos (Hardware e Software)

Para executar o projeto, o servidor ou máquina host deve atender aos seguintes requisitos:

### Hardware Recomendado
* **CPU:** 2 vCPUs ou superior.
* **RAM:** Mínimo de 4GB (Recomendado 8GB para build dos containers).
* **Armazenamento:** 20GB livres em disco.

### Software Necessário
* **Sistema Operacional:** Linux (Ubuntu 20.04+), Windows 10/11 (com WSL2) ou macOS.
* **Git:** Para clonagem do repositório.
* **Docker Engine:** Versão 20.10 ou superior (no Windows/macOS, Docker Desktop).
* **Docker Compose:** Versão 1.29 ou superior (ou plugin docker compose v2).
* **Node.js:** Versão 18 ou superior (para rodar o frontend).

## 2. Estrutura da Aplicação

A aplicação é dividida em três partes:

| Serviço | Tecnologia | Como roda | Porta |
|---|---|---|---|
| **Database** | MariaDB 10.6 | Docker Compose (`Banckend/docker-compose.yml`) | 3306 |
| **Backend (API)** | Python + FastAPI | Docker Compose (`Banckend/docker-compose.yml`) | 8000 |
| **Frontend** | React + Vite | `npm run dev` na pasta `Frontend` | 5173 |

## 3. Configuração de Variáveis de Ambiente

O backend lê suas configurações do arquivo `Banckend/.env` (que não é versionado).

1. Dentro da pasta `Banckend`, copie o arquivo `.env.example` para `.env`.
2. Edite o `.env`:

```env
# Conexão com o MariaDB (host "db-mariadb" é o nome do serviço no docker-compose.yml)
DB_STRING=mysql+mysqlconnector://app_user:python123@db-mariadb:3306/imimpressoras_db

# Chave usada para assinar os tokens JWT
SECRET_KEY=troque-por-uma-chave-aleatoria

SALT=troque-por-um-valor-qualquer
```

* O usuário, a senha e o nome do banco em `DB_STRING` devem bater com os valores de `Banckend/docker-compose.yml`.
* Para gerar uma `SECRET_KEY` segura: `python -c "import secrets; print(secrets.token_hex(32))"`

## 4. Procedimento de Instalação e Execução

### 4.1 Clonar o repositório
```bash
git clone <url-do-repositorio>
cd g2
```

### 4.2 Subir o banco de dados e o backend
Com o Docker em execução, a partir da pasta `Banckend`:

```bash
cd Banckend

# Em primeiro plano (ver logs no terminal)
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

As tabelas do banco são criadas automaticamente quando o backend inicia (`Base.metadata.create_all` em `main.py`); não é necessário rodar migrações.

> Na primeira execução o backend pode reiniciar algumas vezes enquanto o MariaDB termina de inicializar. Isso é esperado: o container está configurado com `restart: unless-stopped` e conecta assim que o banco fica pronto.

### 4.3 Rodar o frontend
Em outro terminal, a partir da raiz do projeto:

```bash
cd Frontend
npm install     # apenas na primeira vez
npm run dev
```

O frontend acessa a API em `http://127.0.0.1:8000/api` (configurado em `Frontend/src/api/api.js`).

## 5. Verificação de Funcionamento

* **Frontend:** acesse http://localhost:5173. A tela de login deve aparecer.
* **Backend:** acesse http://localhost:8000/api (deve responder `API online e funcionando!`) ou http://localhost:8000/docs para a documentação Swagger.
* **Banco de Dados:** os logs do container `printer_db_manager` devem indicar "ready for connections" (`docker logs printer_db_manager`).

## 6. Troubleshooting Comum

* **Backend não inicia / erro de conexão com o banco:** confira se o arquivo `Banckend/.env` existe e se a `DB_STRING` bate com as credenciais do `docker-compose.yml`. Veja os logs com `docker logs printer_app_backend`.
* **Erro de CORS no navegador:** a API só aceita requisições de `http://localhost:5173`. Acesse o frontend por esse endereço (e não por `127.0.0.1:5173`), ou adicione a origem na lista `origins` em `Banckend/main.py`.
* **Porta em uso:** certifique-se de que as portas 5173, 8000 e 3306 não estão ocupadas por outros serviços no host (ex: um MySQL/MariaDB local usando a 3306).
