// src/controllers/userController.ts
import { Request, Response } from "express";
import { registerUser, loginUser, updateUser } from "../services/userService";
import { db } from "../config/db";

// Registro de usuário
export const register = async (req: Request, res: Response): Promise<Response> => {
  const userData = {
    ...req.body,
    photo: req.file?.buffer?.toString("base64") || null,
  };

  const result = await registerUser(userData);
  return res.status(result.status).json(result.body);
};

// Login de usuário
export const login = async (req: Request, res: Response): Promise<Response> => {
  const result = await loginUser(req.body);
  return res.status(result.status).json(result.body);
};

// Atualização de perfil
export const update = async (req: Request, res: Response): Promise<Response> => {
  const userId = String(req.body.id);

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "ID inválido para atualização." });
  }

  const userData = {
    ...req.body,
    photo: req.file?.buffer?.toString("base64") || req.body.photo,
  };

  const result = await updateUser(userId, userData);
  return res.status(result.status).json(result.body);
};

// Busca usuário por ID (para Cart)
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT id, name, email, phone, gender, street, neighborhood, city, photo FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    return res.status(500).json({ error: "Erro interno ao buscar usuário" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT email, phone AS telefone, photo_base64 AS foto FROM users`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

