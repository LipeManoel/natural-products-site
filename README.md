# 🌱 Natura Pura - Produtos Naturais

Aplicação completa de e-commerce de produtos naturais com login, carrinho, favoritos e interface moderna.

---

## ✨ Funcionalidades

- ✅ Cadastro e Login (JWT)
- ✅ Lista de produtos naturais
- ✅ Adicionar/Remover dos Favoritos
- ✅ Carrinho de compras completo (aumentar/diminuir quantidade)
- ✅ Design bonito e responsivo (gradientes, animações, mobile-first)
- ✅ Proteção de rotas com token
- ✅ Pop-ups de feedback

---

## 🛠 Tecnologias

**Frontend**
- React 18 + Vite
- React Router
- Lucide React (ícones)
- CSS Modules (arquivos `.css` externos)

**Backend**
- Node.js + Express
- MySQL2
- JWT (autenticação)
- bcryptjs (senhas)

---

## 📁 Estrutura de Pastas (Frontend)
NATURAL-PRODUCTS-SITE/
├── backend/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js               ← API completa (Express + MySQL + JWT)
├── database/
│   └── schema.sql              ← Script de criação das tabelas
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── images/
│   │       ├── products/       ← Imagens dos produtos (jpg/png)
│   │       └── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── cart/
│   │   │   │   └── Cart.jsx
│   │   │   ├── common/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── footer.css
│   │   │   ├── header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── header.css
│   │   │   ├── favorites/
│   │   │   │   └── Favorites.jsx
│   │   │   └── products/
│   │   │       └── Products.jsx
│   │   ├── pages/
│   │   │   └── auth/
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       └── auth.css
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx     ← Página principal após login
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── shop.css          ← Estilos compartilhados (produtos/carrinho/favoritos)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .gitignore
└── README.md

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js ≥ 18
- MySQL instalado e rodando
- Crie o banco `natural_products_db` e execute o `database/schema.sql`

### 1. Backend
```bash
cd backend
npm install
node server.js
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```