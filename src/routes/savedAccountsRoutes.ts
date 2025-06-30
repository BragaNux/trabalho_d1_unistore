import { Router } from "express";
import * as savedAccountController from "../controllers/savedAccountController";

const router = Router();

router.get("/:userId", async (req, res, next) => {
  try {
    await savedAccountController.getSavedAccounts(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await savedAccountController.addSavedAccount(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await savedAccountController.deleteSavedAccount(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
