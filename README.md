# 🛠 UniStore Backend - API de E-commerce Acadêmico

Este é o backend da **UniStore**, uma plataforma de e-commerce voltada para estudantes. Desenvolvido com **Node.js + Express + PostgreSQL**, gerencia contas de usuários, produtos, carrinho de compras, pedidos, pagamentos e rastreamento.

---

## ⚙️ Tecnologias Utilizadas

* **Node.js** com **Express**
* **TypeScript**
* **PostgreSQL** (sem uso de ORM como Prisma ou afins)
* **pg** para conexão com o banco de dados
* **dotenv** para configurações de ambiente

---

## 📁 Estrutura de Pastas

```
unistore-backend/
├── src/
│   ├── config/          # Conexão com o banco (db.ts)
│   ├── controllers/     # Lógica das rotas (users, orders, payments, etc)
│   ├── routes/          # Rotas da API
│   ├── services/        # Lógicas reutilizáveis
│   ├── middlewares/     # Validações, autenticação, etc
│   ├── app.ts           # App Express principal
│   └── server.ts        # Inicialização do servidor
├── .env
├── package.json
├── tsconfig.json
```

---

## 🔌 Conexão com o Banco

No arquivo `.env`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/unistore_db
PORT=3333
```

Arquivo `db.ts`:

```ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

---

## 📦 Endpoints da API

### ✉️ Usuários

* `POST /api/users/register` - Cria um novo usuário
* `POST /api/users/login` - Autentica usuário (JWT opcional)

### 🛒 Carrinho

* `POST /api/cart/add` - Adiciona item ao carrinho
* `GET /api/cart/:userId` - Busca itens do carrinho
* `DELETE /api/cart/:cartItemId` - Remove item do carrinho

### 📦 Pedidos

* `POST /api/orders/checkout` - Finaliza compra
* `GET /api/orders/:userId` - Lista pedidos do usuário
* `GET /api/orders/details/:orderId` - Itens de um pedido

### 💳 Pagamentos

* Criado automaticamente com o pedido
* Campos: `order_id`, `method`, `status`, `transaction_code`

### 🛍 Rastreamento

* `GET /api/tracking/:orderId` - Busca status atual
* `POST /api/tracking` - Cria novo rastreio
* `PUT /api/tracking/:orderId` - Atualiza status (ex: para "shipped")

> Status válidos para rastreamento: `processing`, `shipped`, `in_transit`, `delivered`

---

## 📊 Exemplo de Checkout (POST /api/orders/checkout)

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "paymentMethod": "pix"
}
```

Resposta:

```json
{
  "message": "Pedido realizado com sucesso",
  "orderId": "abc123",
  "paymentStatus": "confirmed",
  "transactionCode": "PIX-abc123-1720024292921"
}
```

---

## ⚡ Testes com Postman

* Criar conta
* Logar usuário
* Adicionar itens no carrinho (POST /api/cart/add)
* Ver carrinho
* Finalizar pedido
* Consultar pedido por userId
* Atualizar status do rastreamento (PUT /api/tracking/\:orderId)

---

## 🧪 Scripts

```bash
npm install        # Instala dependências
npm run dev        # Inicia servidor com ts-node-dev
```

---

## 📄 Modelo de Tabelas (Resumo)

* `users(id, name, email, password)`
* `products(id, name, description, price, image)`
* `carts(id, user_id)`
* `cart_items(id, cart_id, product_id, quantity, price_at_time)`
* `orders(id, user_id, total_amount, status, payment_method)`
* `order_items(id, order_id, product_id, quantity, price_at_time)`
* `payments(id, order_id, method, status, transaction_code)`
* `tracking(id, order_id, status, updated_at)`

---

## 🚀 Roadmap Futuro

* [ ] Autenticação JWT completa
* [ ] Admin para gestão de produtos/pedidos
* [ ] Upload de imagens reais (com multer)
* [ ] Integração real com gateway de pagamento

---

## 👨‍💻 Desenvolvido por

**Brayan Martins**
[GitHub](https://github.com/BragaNux) | [LinkedIn](https://linkedin.com/in/bmartlns)
