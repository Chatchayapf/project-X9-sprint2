import { Router } from "express";
import { router as productsRoutes } from "./products.routes.js";
import { router as usersRoutes } from "./users.routes.js";
import { router as cartRoutes } from "./cart.routes.js";
import { router as authRoutes } from "./auth.routes.js";
import { router as adminRoutes } from "./admin.routes.js";

export const router = Router();
router.use("/products", productsRoutes);
router.use("/users", usersRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
