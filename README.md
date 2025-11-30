# Projeto Petshop - Fullstack

Sistema web simples para gestão de um petshop, com backend em Node.js/Express (API REST com JWT) e frontend em HTML/CSS/JS consumindo a API via Fetch.

## Tecnologias usadas

- **Backend**
  - Node.js
  - Express
  - JWT (`jsonwebtoken`)
  - `bcryptjs` para senha
  - `swagger-ui-express` e `swagger-jsdoc` para documentação
  - Persistência em arquivo `db.json` (sem banco de dados externo)
- **Frontend**
  - HTML5
  - CSS3
  - JavaScript puro
  - Bootstrap 5 para layout

Tema: **Petshop** (CRUD de Tutores, Pets, Serviços, Produtos e Agendamentos).

---

## Como rodar o backend

Na pasta `backend`:

```bash
cd backend
npm install
npm run dev
```

Isso sobe o servidor em:

- `http://localhost:3000`

### Usuário padrão

Ao iniciar o servidor, é criado automaticamente um usuário administrador:

- **E-mail**: `admin@petshop.com`
- **Senha**: `admin123`

Esse usuário é usado para fazer login e obter o token JWT.

### Documentação Swagger

A documentação da API está disponível em:

- `http://localhost:3000/api-docs`

Lá é possível visualizar todos os endpoints, modelos e testar as requisições.

---

## Como rodar o frontend

Na pasta `frontend` há apenas arquivos estáticos. Algumas opções para rodar:

- Abrir o `index.html` com uma extensão tipo **Live Server** (VS Code).
- Usar um servidor estático simples (por exemplo, `npx serve` ou hospedar no Replit/Codespaces).

Exemplo usando `npx serve` (opcional):

```bash
cd frontend
npx serve
```

Depois, abra o endereço que o comando indicar (geralmente `http://localhost:3000` ou similar). Se usar outra porta, só cuide para que o backend continue em `http://localhost:3000` (como está configurado em `frontend/js/api.js`). Se precisar mudar, é só ajustar a constante `API_BASE_URL` nesse arquivo.

---

## Fluxo de uso da aplicação

1. Inicie o backend (`npm run dev` na pasta `backend`).
2. Inicie/abra o frontend (arquivo `frontend/index.html` sendo servido por algum servidor estático).
3. Na tela de login do frontend, use:
   - E-mail: `admin@petshop.com`
   - Senha: `admin123`
4. Após o login, o token JWT é salvo no `localStorage` e passado automaticamente no header `Authorization` das requisições.
5. Use as abas para gerenciar:
   - **Tutores**
   - **Pets**
   - **Serviços**
   - **Produtos**
   - **Agendamentos**

Todas as operações de CRUD (listar, criar, editar, excluir) passam pela API protegida com JWT.

---

## Entidades e campos

### Tutores

- `id` (gerado pela API)
- `nome` (obrigatório)
- `contato`
- `endereco`
- `telefone` (obrigatório)

### Pets

- `id` (gerado pela API)
- `nome` (obrigatório)
- `especie` (obrigatório)
- `raca`
- `sexo`
- `tutorId` (obrigatório, deve existir na lista de tutores)

### Serviços

- `id` (gerado pela API)
- `nome` (obrigatório)
- `descricao`
- `preco` (obrigatório)

### Produtos

- `id` (gerado pela API)
- `nome` (obrigatório)
- `descricao`
- `preco` (obrigatório)
- `estoque`

### Agendamentos

- `id` (gerado pela API)
- `tutorId` (obrigatório)
- `petId` (obrigatório)
- `servicoId` (obrigatório)
- `dataHora` (obrigatório)
- `status` (PENDENTE, CONFIRMADO, CONCLUIDO, CANCELADO)

As validações básicas (por exemplo, se `tutorId`, `petId` e `servicoId` existem) são feitas no backend.

---

## Observações

- O CORS já está liberado no backend para permitir o acesso do frontend.
- A persistência é feita em arquivo `db.json` na raiz do backend, para simplificar o projeto.
- Se for hospedar em Replit/Codespaces, basta configurar o start do backend e apontar o frontend para a URL gerada (ajustando `API_BASE_URL` em `frontend/js/api.js` se necessário).

Esse projeto serve como base de estudo de um CRUD fullstack simples com autenticação JWT.


