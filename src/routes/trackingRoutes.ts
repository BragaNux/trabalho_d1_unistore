import { Router } from "express";
import * as trackingController from "../controllers/trackingController";

const router = Router();

router.get("/:orderId", async (req, res, next) => {
  try {
    await trackingController.getTracking(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await trackingController.createTracking(req, res);
  } catch (err) {
    next(err);
  }
});

router.put("/:orderId", async (req, res, next) => {
  try {
    await trackingController.updateTracking(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
