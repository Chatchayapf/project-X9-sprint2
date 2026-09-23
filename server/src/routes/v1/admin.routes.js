import { Router } from "express";
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js";
import { getAllProducts } from "../../controllers/admin.controller.js";

export const router = Router();

router.use(authUser, authAdmin);

router.get("/products", getAllProducts);
