# 🏫 UniStore - E-commerce Acadêmico

**UniStore** é um aplicativo de compras voltado para estudantes, com foco em simplicidade, visual limpo e integração com métodos de pagamento simulados. Desenvolvido com **React + TypeScript**, ele agora possui **backend completo com Node.js + PostgreSQL**, salvando todos os dados reais no banco.

---

## ✨ Novidades

* ✅ Backend completo com **Node.js + Express** e banco **PostgreSQL**
* 🌐 API REST para login, cadastro, produtos, pedidos, pagamentos e rastreamento
* 📂 Carrinho e pedidos agora são persistidos no banco por usuário logado
* 🚚 Rastreio dinâmico com atualização de status por etapa de entrega

---

## 🚀 Funcionalidades

* 💼 Cadastro/Login com JWT e upload de imagem de perfil
* 🛍️ Catálogo dinâmico de produtos com imagem e preço do banco
* 🛒 Carrinho individual por usuário, salvo no banco
* 📦 Histórico de pedidos e detalhes com foto dos produtos
* 📅 Rastreamento em tempo real por etapa de entrega
* 💳 Pagamentos por Pix, Boleto e Cartão com simulação de transação
* 📱 Design responsivo e tema moderno estilo "universidade"

---

## 💸 Métodos de Pagamento

### 1. Pix

* Gera QR Code simulando pagamento instantâneo
* Marca pedido como **confirmado** ao clicar em "Pagar com Pix"

### 2. Boleto

* Exibe código de barras fictício
* Simula pagamento após clique em "Pagar"

### 3. Cartão de Crédito

* Verifica bandeira automaticamente (Visa, Mastercard, etc.)
* Aplica máscara ao número do cartão
* Gera pedido só ao confirmar pagamento

---

## 📦 Exemplo de Pedido Registrado (Banco)

```json
{
  "id": "abc123",
  "user_id": "xyz789",
  "items": [
    { "name": "Caneca Universitária", "quantity": 1, "price_at_time": 49.90 },
    { "name": "Livro de Cálculo", "quantity": 1, "price_at_time": 39.90 }
  ],
  "total_amount": 89.90,
  "payment_method": "Cartão",
  "status": "processing",
  "tracking_status": "Separando Estoque"
}
```

---

## 🕝 Rastreamento de Pedido

Cada pedido possui etapa de entrega controlada via API:

```markdown
1. Pedido Recebido
2. Separando Estoque
3. Saiu para Entrega
4. Entregue
```

Exibido com barra de progresso e ícones de status visuais.

---

## 📂 Estrutura de Telas

* `Start.tsx` – Tela inicial
* `Login.tsx` – Login com JWT
* `CreateAccount.tsx` – Criação de conta com foto
* `Shop.tsx` – Lista produtos do banco
* `ProductView.tsx` – Detalhes do produto
* `Cart.tsx` – Carrinho persistente
* `Payment.tsx` – Escolha de pagamento
* `Pix.tsx`, `Boleto.tsx`, `CreditCard.tsx` – Telas de pagamento
* `Orders.tsx` – Pedidos do usuário
* `OrderTracking.tsx` – Rastreamento dinâmico

---

## 🧶 Tecnologias Utilizadas

### Frontend

* React + Vite + TypeScript
* React Router DOM
* Context API (estado global)
* Styled CSS e imagens do Flaticon/Unsplash

### Backend

* Node.js + Express + TypeScript
* PostgreSQL com SQL puro (sem Prisma)
* JWT + Bcrypt para autenticação
* Multer para upload de imagens

---

## 📌 Observações

* Backend exposto em `http://localhost:3333`
* Projeto simula e-commerce real com API funcional e persistência

---

## 👨‍💻 Desenvolvido por

**Brayan**
[GitHub](https://github.com/BragaNux)
[LinkedIn](https://www.linkedin.com/in/bmartlns/)
