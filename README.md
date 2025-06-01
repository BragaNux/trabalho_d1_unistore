# 🏫 UniStore - E-commerce Acadêmico

**UniStore** é um aplicativo de compras voltado para estudantes, com foco em simplicidade, visual limpo e integração com métodos de pagamento simulados. Desenvolvido com **React + TypeScript**, ele utiliza `localStorage` para simular o fluxo completo de um e-commerce: do carrinho ao rastreamento do pedido.

---

## 🚀 Funcionalidades

- 🛍️ Carrinho de compras com suporte a múltiplos itens
- 👤 Login/Criação de conta local via `localStorage`
- 📦 Histórico de pedidos (`Orders`) com detalhamento completo
- 🧾 Rastreamento de pedido (`OrderTracking`) por etapas visuais
- 💳 Pagamentos com Pix, Boleto e Cartão de Crédito
- 📱 Interface responsiva e acadêmica, com tema limpo

---

## 💸 Métodos de Pagamento

### 1. Pix
- Gera um QR Code visual simulando pagamento instantâneo
- Após clicar em “Pagar com Pix”, o pedido é salvo e marcado como **Pago**

### 2. Boleto
- Exibe um boleto com código de barras fictício
- Simula pagamento no clique e confirma o pedido

### 3. Cartão de Crédito
- Preenchimento com verificação automática da bandeira (Visa, Mastercard, etc.)
- Máscara aplicada ao número do cartão
- Pedido é criado **somente após** clicar em "Confirmar Pagamento"

---

## 📦 Exemplo de Pedido Registrado

```json
{
  "id": "abc123",
  "items": ["Caneca Universitária", "Livro de Cálculo"],
  "total": 89.90,
  "metodo": "Cartão de Crédito",
  "bandeira": "Visa",
  "status": "Pago"
}
```

---

## 🕝 Rastreamento de Pedido

Cada pedido possui uma etapa de entrega simulada:

```markdown
1. Pedido Recebido
2. Separando Estoque
3. Saiu para Entrega
4. Entregue
```

Visualmente representado com barra de progresso e etapas completas/pending.

---

## 🗂️ Estrutura de Telas

- `Start.tsx` – Tela inicial de boas-vindas
- `Login.tsx` – Tela de login
- `CreateAccount.tsx` – Cadastro de conta
- `Shop.tsx` – Catálogo de produtos
- `ProductView.tsx` – Detalhe do produto
- `Cart.tsx` – Carrinho de compras
- `Payment.tsx` – Escolha de método de pagamento
- `Pix.tsx`, `Boleto.tsx`, `CreditCard.tsx` – Telas de pagamento
- `Orders.tsx` – Histórico de pedidos
- `OrderTracking.tsx` – Rastreamento visual da entrega

---

## 🧢 Tecnologias Utilizadas

- React + Vite + TypeScript
- React Router DOM
- Context API para estado global (carrinho)
- LocalStorage como simulação de backend
- CSS Modularizado
- Ícones e imagens: Flaticon, Unsplash, etc.

---

## 📌 Observações

- Este projeto é totalmente **frontend** com persistência em `localStorage`.
- Ideal para fins educacionais e demonstração de fluxo e-commerce completo.

---

## 👨‍💻 Desenvolvido por

**Brayan**  
[GitHub](https://github.com/BragaNux)  
[LinkedIn](https://www.linkedin.com/in/bmartlns/)
