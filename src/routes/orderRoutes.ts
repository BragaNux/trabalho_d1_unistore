import { Router } from "express";
import * as orderController from "../controllers/orderController";

const router = Router();

router.post("/checkout", async (req, res, next) => {
  try {
    await orderController.checkout(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    await orderController.getUserOrders(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/details/:orderId", async (req, res, next) => {
  try {
    await orderController.getOrderDetails(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
