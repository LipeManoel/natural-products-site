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