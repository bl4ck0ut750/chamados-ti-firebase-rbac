# HelpDesk TI — Autenticação Firebase e RBAC

**Aluno(a):** Victor Hugo Santana dos Santos
**Aplicação no Render:** _preencha com a URL pública após o deploy_

Sistema MVC com Node.js, Express, EJS, Sequelize/SQLite e Firebase Authentication. O acesso é protegido por sessão Firebase e há três perfis: `user`, `tecnico` e `admin`.

## Configuração local

```bash
npm install
npm run build
npm start
```

Crie um aplicativo Web no Firebase, habilite E-mail/Senha e Google e configure as variáveis abaixo. O navegador usa as variáveis `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID` e `FIREBASE_APP_ID`. O servidor valida os tokens usando `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON completo da conta de serviço) **ou** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY`. Nunca versione a chave privada.

Exemplo de `.env` para desenvolvimento:

```env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
FIREBASE_SERVICE_ACCOUNT_JSON={...}
```

No primeiro login, o servidor cria automaticamente o registro em `usuarios` com perfil `user`. Para validar o painel, promova um usuário para `admin` no banco, ou use o painel de usuários depois de promover a primeira conta.

## Regras de acesso

- `user`: cria chamados e visualiza somente aqueles cujo `autorUid` é o próprio UID Firebase.
- `tecnico`: visualiza todos os chamados e pode assumir, comentar e atualizar status/prioridade.
- `admin`: possui acesso total aos chamados e gerencia técnicos, categorias e perfis de usuários.

Cada chamado novo grava `autorUid`, `autorNome`, `autorEmail`, `status: aberto` e `technicianId: null`.

## Deploy no Render

Crie um **Web Service** conectado ao repositório. Use `npm install` como Build Command, `npm start` como Start Command e adicione todas as variáveis Firebase no ambiente do Render. O banco SQLite é local ao serviço; para produção persistente, configure um disco ou migre a persistência para um banco gerenciado. Depois do deploy, adicione o domínio `*.onrender.com` em Firebase Authentication → Settings → Authorized domains.
