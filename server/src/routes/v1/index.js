import { Router } from "express";
import { router as productsRoutes } from "./products.routes.js";

export const router = Router();
router.use("/products", productsRoutes);
