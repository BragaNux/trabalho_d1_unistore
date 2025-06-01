# 📦 UniStore – E-commerce Acadêmico

Este projeto simula uma loja online acadêmica com funcionalidades completas de login, cadastro, carrinho, pagamento e rastreamento de pedidos.

## 🗂 Estrutura de Pastas

```
unistore_frontend/
│
├── public/                # Imagens públicas (como logo e perfil)
│
├── src/
│   ├── assets/            # Imagens dos produtos
│   │   └── images/
│   │       └── products/  # Fotos dos produtos
│   │
│   ├── context/
│   │   └── CartContext.tsx      # Lógica do carrinho com Context API
│   │
│   ├── pages/             # Telas principais do app
│   │   ├── Start.tsx              # Tela inicial
│   │   ├── Login.tsx              # Tela de login
│   │   ├── CreateAccount.tsx      # Criação de conta
│   │   ├── SavedAccounts.tsx      # Seleção de contas salvas
│   │   ├── Shop.tsx               # Loja de produtos
│   │   ├── ProductView.tsx        # Detalhes do produto
│   │   ├── Cart.tsx               # Carrinho
│   │   ├── Payment.tsx            # Tela de escolha de pagamento
│   │   ├── Pix.tsx                # Pagamento via Pix (QR Code)
│   │   ├── Boleto.tsx             # Pagamento via boleto
│   │   ├── CreditCard.tsx         # Pagamento via cartão
│   │   ├── Orders.tsx             # Lista de pedidos
│   │   ├── OrderTracking.tsx      # Rastreamento do pedido
│   │   ├── Profile.tsx            # Perfil do usuário
│   │   └── NotFound.tsx           # Página 404
│   │
│   └── routes/
│       └── AppRoutes.tsx          # Definição das rotas do app
│
├── App.tsx                    # Componente principal
├── main.tsx                   # Ponto de entrada da aplicação
├── index.html                 # HTML principal
├── package.json               # Dependências e scripts
└── tsconfig.json               # Configurações do TypeScript
```

## 🚀 Como Rodar

```bash
npm install
npm run dev
```

Acesse no navegador: `http://localhost:0000`

## 👨‍💻 Tecnologias

- React + TypeScript
- Vite
- Context API
- localStorage
- CSS modular
- React Router

---
