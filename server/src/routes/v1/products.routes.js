import { Router } from "express";
import { getAllProducts, getProductById } from "../../controllers/product.controller.js";

export const router = Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);
