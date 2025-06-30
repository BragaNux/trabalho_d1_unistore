import { Request, Response } from "express";
import { db } from "../config/db";

// ✅ Adiciona produto ao carrinho
export const addToCart = async (req: Request, res: Response) => {
  const { userId, productId, quantity, price } = req.body;

  try {
    // Verifica se o carrinho já existe
    const existingCart = await db.query(
      `SELECT id FROM carts WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    let cartId = existingCart.rows[0]?.id;

    // Se não existir, cria novo
    if (!cartId) {
      const newCart = await db.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
        [userId]
      );
      cartId = newCart.rows[0].id;
    }

    // Verifica se o item já existe no carrinho
    const existingItem = await db.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartId, productId]
    );

    if (existingItem.rows.length > 0) {
      const newQty = existingItem.rows[0].quantity + quantity;
      await db.query(
        `UPDATE cart_items SET quantity = $1 WHERE id = $2`,
        [newQty, existingItem.rows[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time) 
         VALUES ($1, $2, $3, $4)`,
        [cartId, productId, quantity, price]
      );
    }

    res.status(200).json({ message: "Item adicionado ao carrinho com sucesso" });
  } catch (err) {
    console.error("Erro ao adicionar item ao carrinho:", err);
    res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
  }
};

// ✅ Busca o carrinho completo do usuário com imagem e nome
// src/controllers/cartController.ts
export const getCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cart = await db.query(
      `SELECT ci.id, ci.product_id, ci.quantity, ci.price_at_time, 
              p.name, ENCODE(p.image, 'base64') AS image
       FROM carts c
       JOIN cart_items ci ON c.id = ci.cart_id
       JOIN products p ON p.id = ci.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    const formattedCart = cart.rows.map((item) => ({
      ...item,
      image: item.image ? `data:image/jpeg;base64,${item.image}` : null,
    }));

    res.status(200).json({ cart: formattedCart });
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res.status(500).json({ error: "Erro ao buscar carrinho" });
  }
};


// ✅ Atualiza quantidade de um item
export const updateCartItem = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cartRes = await db.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    const cartId = cartRes.rows[0]?.id;

    if (!cartId) return res.status(404).json({ error: "Carrinho não encontrado" });

    if (quantity <= 0) {
      await db.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productId]
      );
    } else {
      await db.query(
        "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, productId]
      );
    }

    res.status(200).json({ message: "Item atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar item:", err);
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
};

// ✅ Remove item do carrinho
export const removeCartItem = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;

  try {
    const cartRes = await db.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    const cartId = cartRes.rows[0]?.id;

    if (!cartId) return res.status(404).json({ error: "Carrinho não encontrado" });

    await db.query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    res.status(200).json({ message: "Item removido do carrinho com sucesso" });
  } catch (err) {
    console.error("Erro ao remover item:", err);
    res.status(500).json({ error: "Erro ao remover item" });
  }
};
