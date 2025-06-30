import { Router } from "express";
import * as productController from "../controllers/productController";
import upload from "../middlewares/upload";

const router = Router();

// Lista todos os produtos
router.get("/", async (req, res, next) => {
	try {
		await productController.getAllProducts(req, res);
	} catch (err) {
		next(err);
	}
});

// Busca produto por ID
router.get("/:id", async (req, res, next) => {
	try {
		await productController.getProductById(req, res);
	} catch (err) {
		next(err);
	}
});

// Cria produto com imagem (formato multipart/form-data)
router.post("/", upload.single("image"), async (req, res, next) => {
	try {
		await productController.createProduct(req, res);
	} catch (err) {
		next(err);
	}
});

// Atualiza produto (imagem não obrigatória aqui)
router.put("/:id", upload.single("image"), async (req, res, next) => {
	try {
		await productController.updateProduct(req, res);
	} catch (err) {
		next(err);
	}
});

// Deleta produto
router.delete("/:id", async (req, res, next) => {
	try {
		await productController.deleteProduct(req, res);
	} catch (err) {
		next(err);
	}
});

export default router;
