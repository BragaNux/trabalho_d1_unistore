import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import savedAccountsRoutes from "./routes/savedAccountsRoutes";
import trackingRoutes from "./routes/trackingRoutes";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/saved-accounts", savedAccountsRoutes);
app.use("/api/tracking", trackingRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno no servidor" });
});

export default app;
