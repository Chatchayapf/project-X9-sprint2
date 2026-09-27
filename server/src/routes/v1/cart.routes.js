import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import { getItemsFromCart, addItemToCart, updateItemInCart, deleteItemInCart, mergeCart } from "../../controllers/cart.controller.js";

export const router = Router();

// Get cart from database and sent to frontend.
router.get("/", authUser, getItemsFromCart);

// Merge a guest cart into the user's saved cart (called once, right after sign in).
router.post("/merge", authUser, mergeCart);

// Add item to cart.
router.post("/items", authUser, addItemToCart);

// Update item in cart (increase, decrease).
router.patch("/items/:id", authUser, updateItemInCart);

// Delete item in cart.
router.delete("/items/:id", authUser, deleteItemInCart);