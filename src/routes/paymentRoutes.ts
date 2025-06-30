import { Router } from "express";
import * as paymentController from "../controllers/paymentController";

const router = Router();

router.post("/create", async (req, res, next) => {
  try {
    await paymentController.createPayment(req, res);
  } catch (err) {
    next(err);
  }
});

router.put("/confirm", async (req, res, next) => {
  try {
    await paymentController.confirmPayment(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/order/:orderId", async (req, res, next) => {
  try {
    await paymentController.getPaymentByOrder(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
