import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

export const registerUser = async (data: any) => {
  try {
    const {
      name,
      email,
      password,
      cpf,
      phone,
      street,
      neighborhood,
      city,
      gender,
      file,
      photo,
    } = data;

    if (!password) {
      return { status: 400, body: { error: "Senha é obrigatória" } };
    }

    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return { status: 400, body: { error: "Usuário já existe" } };
    }

    const hash = await bcrypt.hash(password, 10);

    // Converte a imagem para base64
    let photoBase64 = null;
    if (file && file.buffer) {
      photoBase64 = file.buffer.toString("base64");
    } else if (photo && typeof photo === "string") {
      // Remove o prefixo se vier no estilo "data:image/png;base64,...."
      photoBase64 = photo.includes("base64,")
        ? photo.split("base64,")[1]
        : photo;
    }

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, cpf, phone, street, neighborhood, city, gender, photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, email, photo`,
      [name, email, hash, cpf, phone, street, neighborhood, city, gender, photoBase64]
    );

    return { status: 201, body: { user: result.rows[0] } };
  } catch (err) {
    console.error("Erro no registro:", err);
    return { status: 500, body: { error: "Erro ao registrar usuário" } };
  }
};


export const updateUser = async (userId: string, data: any) => {
  try {
    const fields = [];
    const values = [];
    let index = 1;

    // Trata foto caso venha como base64 completa (ex: "data:image/png;base64,...")
    if (data.photo && typeof data.photo === "string" && data.photo.startsWith("data:image")) {
      const base64 = data.photo.split(",")[1];
      data.photo = base64;
    }

    const allowedFields = ["name", "phone", "street", "neighborhood", "city", "photo"];
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${index++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) {
      return { status: 400, body: { error: "Nada para atualizar." } };
    }

    values.push(userId);

    await db.query(
      `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${index}`,
      values
    );

    const updated = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

    return { status: 200, body: { user: updated.rows[0] } };
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    return { status: 500, body: { error: "Erro ao atualizar perfil." } };
  }
};

export const loginUser = async ({ email, password }: any) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return { status: 401, body: { error: "Credenciais inválidas" } };

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return { status: 401, body: { error: "Credenciais inválidas" } };

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    return {
      status: 200,
      body: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          street: user.street || "",
          neighborhood: user.neighborhood || "",
          city: user.city || "",
          foto: user.photo ? `data:image/png;base64,${user.photo}` : null,
        },
      },
    };
  } catch (err) {
    console.error("Erro no login:", err);
    return { status: 500, body: { error: "Erro ao fazer login" } };
  }
};

