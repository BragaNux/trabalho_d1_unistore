import { Router } from "express";
import * as userController from "../controllers/userController";
import upload from "../middlewares/upload";

const router = Router();

router.post("/register", upload.single("photo"), async (req, res, next) => {
  try {
    await userController.register(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await userController.login(req, res);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", upload.single("photo"), async (req, res, next) => {
  try {
    await userController.update(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    await userController.getById(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
