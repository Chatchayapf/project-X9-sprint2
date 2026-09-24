import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import { checkoutNormalItems, checkoutCustomItems } from "../../controllers/checkout.controller.js";

export const router = Router();

// Chechout normal items
router.post("/", authUser, checkoutNormalItems)

// Checkout custom item
router.post("/custom", authUser, checkoutCustomItems)

