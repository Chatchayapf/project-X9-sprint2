import { Router } from "express";
import { router as productsRoutes } from "./products.routes.js";
import { router as usersRoutes } from "./users.routes.js";
import { router as cartRoutes } from "./cart.routes.js"

export const router = Router();
router.use("/products", productsRoutes);
router.use("/users", usersRoutes);
router.use("/cart", cartRoutes)
