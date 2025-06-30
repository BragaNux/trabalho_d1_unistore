import { Request, Response } from "express";
import { db } from "../config/db";

// POST /api/orders/checkout
export const checkout = async (req: Request, res: Response) => {
  const { userId, paymentMethod } = req.body;

  try {
    // 1. Verifica carrinho
    const cart = await db.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
    const cartId = cart.rows[0]?.id;
    if (!cartId) return res.status(400).json({ error: "Carrinho vazio" });

    // 2. Busca itens do carrinho com nome e preço atual
    const cartItems = await db.query(`
      SELECT ci.*, p.name, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ error: "Carrinho sem itens" });
    }

    // 3. Calcula total
    const total = cartItems.rows.reduce(
      (acc, item) => acc + (item.price_at_time * item.quantity),
      0
    );

    // 4. Cria pedido
    const order = await db.query(`
      INSERT INTO orders (user_id, total_amount, status, payment_method)
      VALUES ($1, $2, 'pending', $3)
      RETURNING id
    `, [userId, total, paymentMethod]);

    const orderId = order.rows[0].id;

    // 5. Insere itens do pedido
    for (const item of cartItems.rows) {
      await db.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.product_id, item.quantity, item.price_at_time]);
    }

    // 6. Cria pagamento vinculado ao pedido
    const transactionCode = `${paymentMethod.toUpperCase()}-${orderId}-${Date.now()}`;
    const status = paymentMethod === "pix" ? "confirmed" : "pending";

    await db.query(`
      INSERT INTO payments (order_id, method, status, transaction_code)
      VALUES ($1, $2, $3, $4)
    `, [orderId, paymentMethod, status, transactionCode]);

    // 7. Limpa carrinho
    await db.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    // 7.5 Cria rastreamento inicial com status válido
    await db.query(`
      INSERT INTO tracking (order_id, status)
      VALUES ($1, $2)
    `, [orderId, "processing"]);


    // 8. Retorna sucesso com ID
    res.status(201).json({
      message: "Pedido realizado com sucesso",
      orderId,
      paymentStatus: status,
      transactionCode
    });
  } catch (err) {
    console.error("Erro no checkout:", err);
    res.status(500).json({ error: "Erro ao finalizar pedido" });
  }
};

// GET /api/orders/:userId
export const getUserOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await db.query(`
      SELECT id, total_amount, status, payment_method, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

// GET /api/orders/details/:orderId
export const getOrderDetails = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const result = await db.query(`
      SELECT oi.quantity, oi.price_at_time, p.name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [orderId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar itens do pedido:", err);
    res.status(500).json({ error: "Erro ao buscar itens do pedido" });
  }
};
