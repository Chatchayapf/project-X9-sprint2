import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import {
    checkoutNormalItems,
    checkoutCustomItems,
} from "../../controllers/checkout.controller.js";

export const router = Router();

// Checkout everything currently in the user's cart
router.post("/", authUser, checkoutNormalItems);

// Checkout a single already-approved custom item
// body: { custom_product_id }
router.post("/custom", authUser, checkoutCustomItems);