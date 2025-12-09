# 🎓 Rede Social Acadêmica - Projeto Full Stack

Projeto final desenvolvido para a disciplina de Arquitetura Web.  
O sistema consiste em uma aplicação Full Stack (SPA) que simula uma rede social acadêmica, permitindo postagens, comentários e controle de acesso hierárquico (Admin vs Aluno).

---

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** & **Express**: Servidor e API RESTful.
- **MongoDB** & **Mongoose**: Banco de dados NoSQL e modelagem de dados.
- **JWT (JsonWebToken)**: Autenticação segura via token.
- **BcryptJS**: Criptografia de senhas (Hash).
- **Cors**: Permissão de acesso entre Frontend e Backend.

### Frontend (SPA)
- **React.js (Vite)**: Biblioteca para interface de usuário.
- **React Router Dom**: Navegação entre páginas (SPA).
- **Axios**: Cliente HTTP para consumir a API.
- **Context API**: Gerenciamento global do estado de autenticação.

---

## 📂 Estrutura do Projeto

O projeto está dividido em dois diretórios principais:

- `/server`: Contém toda a lógica do Backend (API, MVC, Conexão com Banco).
- `/client`: Contém a interface Frontend em React.

---

## ⚙️ Guia de Instalação e Execução

### Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (v16 ou superior)
- **MongoDB** (Rodando localmente ou via Docker na porta 27017)

---

### 1. Configurando o Backend (Servidor)

Abra um terminal, entre na pasta `server` e instale as dependências:

```bash
cd server
npm install
```

Crie um arquivo chamado `.env` dentro da pasta `server` com o seguinte conteúdo:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rede-social-academica
JWT_SECRET=sua_chave
```

Inicie o servidor:

```bash
npm run dev
```

**Backend rodando em:** http://localhost:5000

---

### 2. Configurando o Frontend (Cliente)

Abra um **novo terminal**, entre na pasta `client` e instale as dependências:

```bash
cd client
npm install
```

Inicie o Frontend:

```bash
npm run dev
```

**Frontend rodando em:** http://localhost:5173 (ou porta indicada pelo Vite)

---

## 🧪 Como Testar as Funcionalidades

O sistema possui dois níveis de acesso: **Aluno** e **Admin**.

### 1. Criar Usuário Comum (Aluno)

- Vá até a tela de registro (`/register`).
- Preencha Nome, Email e Senha.
- Deixe o campo **"Código Admin"** em branco.
- **Permissões:** Pode postar e comentar, mas **não** pode excluir posts.

### 2. Criar Usuário Administrador (Admin)

- Vá até a tela de registro.
- Preencha Nome, Email e Senha.
- No campo **"Código Admin"**, digite: `admin123`
- **Permissões:** Acesso total, incluindo o botão vermelho **"Excluir Post"**.

---