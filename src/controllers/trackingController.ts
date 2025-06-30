import { Request, Response } from "express";
import { db } from "../config/db";

// GET /api/tracking/:orderId
export const getTracking = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM tracking WHERE order_id = $1 ORDER BY updated_at DESC LIMIT 1",
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rastreamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar rastreamento" });
  }
};

// POST /api/tracking
export const createTracking = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO tracking (order_id, status) VALUES ($1, $2) RETURNING *",
      [orderId, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar rastreamento" });
  }
};

// PUT /api/tracking/:orderId
export const updateTracking = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query(
      `UPDATE tracking SET status = $1, updated_at = now()
       WHERE order_id = $2
       RETURNING *`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rastreamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar rastreamento" });
  }
};
