# Calculadora de Orçamento

Este repositório contém uma aplicação web de **Calculadora de Orçamento** desenvolvida com **React + TypeScript** no front-end e **Node.js + Express + Prisma + MySQL** no back-end. A aplicação permite cadastrar clientes, adicionar itens com valores unitários, gerar orçamentos dinâmicos, editar/excluir linhas, e exportar ou compartilhar o orçamento.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão LTS recomendada, ≥ 18.x)
- **npm** (já acompanha o Node.js)
- **MySQL** (Community Server ou equivalente) para ambiente local
- **Git** (opcional, para clonar o repositório)

---

## 🗂️ Estrutura de Pastas

```
Calculadora Orçamentária/
├─ backend/       # API Express + Prisma
│   ├─ prisma/    # Esquema e client Prisma
│   ├─ src/       # Código TypeScript/JavaScript do servidor
│   └─ .env       # Variáveis de ambiente (SECRET)
└─ frontend/      # App React + TypeScript
    ├─ src/       # Componentes, páginas e estilos
    └─ .env       # Variáveis de ambiente (VITE_API_URL)
```

---

## ⚙️ Configuração do Back-end

1. Abra um terminal no diretório **`backend/`**:
   ```bash
   cd "Calculadora Orçamentária/backend"
   ```

2. Crie (ou edite) o arquivo `.env` com a string de conexão para o seu MySQL local:
   ```env
   DATABASE_URL="mysql://root:SUA_SENHA@127.0.0.1:3306/budget_app"
   ```
   > **Dica**: substitua `SUA_SENHA` pela senha do seu usuário MySQL.

3. Instale dependências:
   ```bash
   npm install express cors dotenv prisma @prisma/client multer
   npm install --save-dev nodemon typescript ts-node
   ```

4. Inicialize e configure o Prisma (se ainda não feito):
   ```bash
   npx prisma init       # gera pasta prisma/ e .env
   npx prisma db pull --url="$DATABASE_URL"  # introspeciona o schema existente
   npx prisma generate   # gera Prisma Client
   ```

5. Adicione scripts no `package.json` (se necessário):
   ```json
   "scripts": {
     "dev": "nodemon src/server.ts"
   }
   ```

6. Execute as migrações ou popule o banco conforme o schema definido no Workbench/MySQL.

7. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O back-end estará disponível em `http://localhost:5000`.

---

## ⚙️ Configuração do Front-end

1. Abra outro terminal no diretório **`frontend/`**:
   ```bash
   cd "Calculadora Orçamentária/frontend"
   ```

2. Crie (ou edite) o arquivo `.env` com a URL da API:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Instale dependências:
   ```bash
   npm install react react-dom react-router-dom axios jspdf xlsx
   npm install --save-dev typescript @types/react @types/react-dom @types/react-router-dom
   ```

4. Certifique-se de importar o CSS global em `src/main.tsx`:
   ```ts
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './global.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O front-end estará disponível em `http://localhost:5173` (ou porta configurada pelo Vite).

---

## 🚀 Executando a Aplicação

1. Com o **back-end** rodando (`localhost:5000`) e o **front-end** rodando (`localhost:5173`), abra o navegador em:
   ```
   http://localhost:5173/
   ```
2. A interface exibirá:
   - Formulário para cadastro de cliente (nome e telefone).
   - Seção de orçamento (selecione item, defina quantidade).
   - Botão **Adicionar** adiciona linhas na tabela abaixo.
   - Tabela interativa com ações **Editar** e **Excluir** em cada linha.
   - Botões de ação: **Salvar Orçamento**, **Exportar Excel**, **Exportar PDF** e **Enviar WhatsApp**.

---

## 📚 Próximos Passos

- **Integração real com o back-end**: substituir itens estáticos pelo fetch de `/api/items` e persistir orçamentos em `/api/budgets`.
- **Implementar exportação** com **SheetJS** e **jsPDF**.
- **Autenticação de usuários** e rotas protegidas.
- **Deploy**: front-end em Netlify/Vercel; back-end em Railway/Heroku.

---

**Boa sorte!** Se surgirem dúvidas, sinta-se à vontade para abrir uma issue ou entrar em contato. :)

