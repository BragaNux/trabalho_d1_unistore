# 🎨 UniStore Frontend - Interface do E-commerce Acadêmico

Este repositório contém **apenas o frontend** do projeto **UniStore**, uma loja virtual voltada para estudantes, desenvolvida com foco em simplicidade, responsividade e simulação completa de um fluxo de e-commerce.

---

## 🚀 Tecnologias Utilizadas

* **React + Vite + TypeScript**
* **React Router DOM**
* **Context API** para gerenciamento global do carrinho
* **CSS modular** com foco em layout limpo e responsivo
* **Armazenamento** via `localStorage` e consumo de **API REST**

---

## 📂 Estrutura de Pastas

```
/src
├── assets/               # Imagens e logos
├── components/           # Componentes reutilizáveis (Navbar, Card, etc.)
├── context/              # Context API para carrinho e usuário
├── pages/                # Telas da aplicação
│   ├── Start.tsx         # Tela inicial
│   ├── Login.tsx         # Login de usuário
│   ├── CreateAccount.tsx # Criação de conta
│   ├── Shop.tsx          # Catálogo de produtos
│   ├── ProductView.tsx   # Detalhe do produto
│   ├── Cart.tsx          # Carrinho
│   ├── Payment/          # Fluxo de pagamento (Pix, Boleto, Cartão)
│   ├── Orders.tsx        # Histórico de pedidos
│   └── OrderTracking.tsx # Rastreamento do pedido
├── AppRoutes.tsx         # Definição de rotas
├── main.tsx              # Entrada da aplicação
└── index.css             # Estilo global
```

---

## 🧠 Funcionalidades

* Cadastro/Login de usuário com persistência local
* Carrinho de compras vinculado ao usuário logado
* Pagamento simulado com 3 métodos:

  * **Pix**: simula QR Code
  * **Boleto**: gera boleto fictício
  * **Cartão de Crédito**: com identificação de bandeira
* Rastreamento visual de pedidos
* Tela de pedidos com filtro por usuário logado
* Integração completa com backend RESTful

---

## 🔐 Integração com Backend

* URL base: `http://localhost:3333`
* APIs consumidas:

  * `POST /api/users/register` - Cadastro
  * `POST /api/users/login` - Login
  * `GET /api/products` - Lista de produtos
  * `POST /api/orders/checkout` - Finaliza pedido
  * `GET /api/orders/:userId` - Lista pedidos do usuário
  * `GET /api/orders/details/:orderId` - Detalhes de um pedido
  * `GET /api/tracking/:orderId` - Status atual do pedido

---

## 📦 Instalação e Execução

```bash
# Clone o repositório
cd unistore-frontend
npm install
npm run dev
```

O sistema estará acessível em `http://localhost:5173`

---

## 📱 Responsividade

O layout é totalmente adaptado para smartphones e desktops, com foco em usabilidade limpa e rápida.

---

## 👤 Desenvolvido por

**Brayan Martins**
[GitHub](https://github.com/BragaNux) | [LinkedIn](https://www.linkedin.com/in/bmartlns/)
