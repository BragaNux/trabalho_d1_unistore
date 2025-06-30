import { Request, Response } from "express";
import { db } from "../config/db";

// Buscar contas salvas do usuário
export const getSavedAccounts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT id, name, cpf, created_at FROM saved_accounts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar contas salvas" });
  }
};

// Adicionar nova conta salva
export const addSavedAccount = async (req: Request, res: Response) => {
  const { userId, name, cpf } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO saved_accounts (user_id, name, cpf) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, cpf]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar conta" });
  }
};

// Remover conta salva
export const deleteSavedAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM saved_accounts WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Conta não encontrada" });
    res.json({ message: "Conta removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover conta" });
  }
};
