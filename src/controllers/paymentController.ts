import { Request, Response } from "express";
import { db } from "../config/db";

// Criar pagamento para um pedido
export const createPayment = async (req: Request, res: Response) => {
  const { orderId, method, transactionCode } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO payments (order_id, method, status, transaction_code) 
       VALUES ($1, $2, 'pending', $3) RETURNING *`,
      [orderId, method, transactionCode]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
};

// Confirmar pagamento (atualizar status e horário)
export const confirmPayment = async (req: Request, res: Response) => {
  const { paymentId } = req.body;

  try {
    // Atualiza pagamento
    await db.query(
      `UPDATE payments SET status = 'confirmed', paid_at = NOW() WHERE id = $1`,
      [paymentId]
    );

    // Atualiza pedido relacionado
    await db.query(
      `UPDATE orders SET status = 'paid' WHERE id = (SELECT order_id FROM payments WHERE id = $1)`,
      [paymentId]
    );

    res.json({ message: "Pagamento confirmado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao confirmar pagamento" });
  }
};

// Buscar pagamento de um pedido
export const getPaymentByOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM payments WHERE order_id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar pagamento" });
  }
};
