import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  userId: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const secret = process.env.JWT_SECRET || "default_secret";

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err || typeof decoded !== "object" || !("userId" in decoded)) {
      res.status(403).json({ error: "Token inválido" });
      return;
    }

    (req as any).user = { id: (decoded as AuthPayload).userId };
    next();
  });
};
