# LabReserve - Setup Local

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git** (opcional, para clonar o repositório)

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório (se usando Git)
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto em modo desenvolvimento
```bash
npm run dev
```

### 4. Acesse no navegador
Abra seu navegador e vá para: `http://localhost:8080`

## 📦 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Verifica problemas no código

## 🏗️ Estrutura do projeto

```
src/
├── components/
│   ├── lab/
│   │   └── WeeklyCalendar.tsx    # Calendário semanal
│   ├── layout/
│   │   └── AppSidebar.tsx        # Sidebar da aplicação
│   └── ui/                       # Componentes UI (shadcn)
├── pages/
│   ├── Dashboard.tsx             # Página inicial
│   ├── Agendar.tsx              # Página de agendamento
│   ├── Reservas.tsx             # Minhas reservas
│   ├── Configuracoes.tsx        # Configurações
│   └── Impressao3D.tsx          # Fila de impressão 3D
├── assets/                      # Imagens e recursos
├── lib/                         # Utilitários
└── hooks/                       # Hooks personalizados
```

## 🎨 Tecnologias utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 🔧 Configurações importantes

### Cores do sistema (definidas em `src/index.css`):
- **Vermelho principal**: `#E60000`
- **Fundo**: Branco
- **Texto**: Tons de cinza

### Responsividade:
- Mobile-first design
- Sidebar colapsível em telas pequenas
- Grid adaptativo para calendário

## 📱 Funcionalidades implementadas

### ✅ Páginas principais:
- [x] Dashboard/Início
- [x] Agendar laboratório
- [x] Minhas reservas
- [x] Configurações
- [x] Fila de impressão 3D

### ✅ Componentes:
- [x] Sidebar responsiva
- [x] Calendário semanal interativo
- [x] Sistema de cores vermelho/branco
- [x] Layout clean e minimalista

## 🚧 Próximos passos (para desenvolvimento)

1. **Backend com Supabase**:
   - Autenticação de usuários
   - Database para reservas
   - Sistema de notificações

2. **Funcionalidades avançadas**:
   - Regras de negócio para agendamento
   - Sistema de fila para impressão 3D
   - Notificações por e-mail

3. **Melhorias de UX**:
   - Loading states
   - Error handling
   - Feedback visual

## 📧 Suporte

Se encontrar algum problema durante a instalação ou execução, verifique:

1. **Node.js atualizado**: `node --version` (deve ser ≥ 18)
2. **Dependências instaladas**: `npm list` 
3. **Porta livre**: Certifique-se que a porta 8080 não está em uso

## 📄 Licença

Este projeto foi criado com Lovable e está pronto para uso educacional.

---

**Desenvolvido com ❤️ usando Lovable**