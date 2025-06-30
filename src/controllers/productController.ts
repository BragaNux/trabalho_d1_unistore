import { Request, Response } from "express";
import { db } from "../config/db";

// Listar todos os produtos
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY created_at ASC");

    const products = result.rows.map((product) => ({
      ...product,
      image: product.image
        ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}`
        : null,
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};


// Buscar produto por ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const product = result.rows[0];

    const productWithImage = {
      ...product,
      image: product.image
        ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}`
        : null,
    };

    res.json(productWithImage);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
};



// Criar novo produto com imagem em base64
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock_quantity, category } = req.body;
  const imageBuffer = req.file?.buffer;

  if (!imageBuffer) {
    return res.status(400).json({ error: "Imagem não enviada" });
  }

  const imageBase64 = imageBuffer.toString("base64");

  try {
    const result = await db.query(
      `INSERT INTO products (name, description, price, image, stock_quantity, category) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, imageBase64, stock_quantity, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

// Atualizar produto por ID com ou sem nova imagem
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity, category } = req.body;
  const imageBase64 = req.file ? req.file.buffer.toString("base64") : undefined;

  try {
    const result = await db.query(
      `UPDATE products SET 
        name = $1,
        description = $2,
        price = $3,
        image = COALESCE($4, image),
        stock_quantity = $5,
        category = $6,
        updated_at = now()
      WHERE id = $7 RETURNING *`,
      [name, description, price, imageBase64, stock_quantity, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

// Deletar produto por ID
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
};
