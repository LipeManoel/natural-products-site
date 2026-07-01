# 🌱 Natura Pura - Natural Products

Complete e-commerce application for natural products with login, cart, favorites, and modern interface.

---

## ✨ Features

- ✅ Registration and Login (JWT)
- ✅ Natural products listing
- ✅ Add/Remove from Favorites
- ✅ Complete shopping cart (increase/decrease quantity)
- ✅ Beautiful and responsive design (gradients, animations, mobile-first)
- ✅ Token-protected routes
- ✅ Feedback pop-ups

---

## 🛠 Technologies

**Frontend**
- React 18 + Vite
- React Router
- Lucide React (icons)
- CSS Modules (external `.css` files)

**Backend**
- Node.js + Express
- MySQL2
- JWT (authentication)
- bcryptjs (passwords)

---

## ♿ Acessibilidade

### Deficientes visuais
- Navegação completa via teclado: `Alt+H` (títulos), `Alt+T` (tabelas), `Alt+M` (conteúdo principal), além de skip link e `Tab` padrão.
- Integração com leitores de tela (VoiceOver/NVDA/TalkBack) via regiões `aria-live`, marcos semânticos e anúncios automáticos de ações (adicionar ao carrinho, favoritar, erros).
- Alto contraste dinâmico com 4 esquemas (Escuro, Claro, Amarelo/Preto, Azul/Amarelo) + padrão.
- Texto ampliável até 200% sem quebrar o layout.

### Surdos e deficientes auditivos
- Transcrição de áudio em tempo real via microfone (Web Speech API — funciona em Chrome/Edge).
- Central de vídeos acessíveis com legendas ocultas (CC) e alternância de janela de tradução em LIBRAS.
- Alertas visuais (flash de tela + banners) para eventos que normalmente seriam sonoros.
- Equalizador de frequências (graves/médios/agudos) com perfis para perda auditiva leve, moderada e severa.

> **Limitação importante:** a tradução em LIBRAS não é gerada automaticamente por IA — a janela fica pronta para receber um vídeo real de intérprete (`librasVideoSrc`). A transcrição de fala depende do suporte do navegador à Web Speech API.

### Baixa visão
- Lupa virtual com 3 modos: tela toda, seção e lente.
- Personalização de fonte: padrão, OpenDyslexic, Arial, Verdana.
- Controle de espaçamento entre linhas, parágrafos e letras.
- Guia de leitura (máscara de tela) que destaca uma faixa central de foco.

Todas as opções ficam no botão flutuante de acessibilidade (ícone ♿ no canto inferior direito) e são salvas automaticamente no navegador.

## 🚀 How to Run the Project


### Prerequisites
- Node.js ≥ 18
- MySQL installed and running
- Create the `natural_products_db` database and run `database/schema.sql`

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