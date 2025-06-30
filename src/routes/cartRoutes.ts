import { Router } from "express";
import * as cartController from "../controllers/cartController";

const router = Router();

// Buscar carrinho do usuário
router.get("/:userId", async (req, res, next) => {
  try {
    await cartController.getCart(req, res);
  } catch (err) {
    next(err);
  }
});

// Adicionar produto ao carrinho
router.post("/add", async (req, res, next) => {
  try {
    await cartController.addToCart(req, res);
  } catch (err) {
    next(err);
  }
});

// Atualizar quantidade de um item no carrinho
router.put("/update", async (req, res, next) => {
  try {
    await cartController.updateCartItem(req, res);
  } catch (err) {
    next(err);
  }
});

// Remover item do carrinho
router.delete("/remove", async (req, res, next) => {
  try {
    await cartController.removeCartItem(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
