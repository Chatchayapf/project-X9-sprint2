import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

// pull in product details for every cart line
const CART_POPULATE = "name price tag img_url";

const populateCart = async (userId) => {
    const populatedUser = await User.findById(userId)
        .select("cart")
        .populate("cart.product_id", CART_POPULATE);

    return populatedUser ? populatedUser.cart : [];
};

export const getItemsFromCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select("cart")
            .populate("cart.product_id", CART_POPULATE); // pull in product details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        next(error);
    }
};

export const addItemToCart = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        const product_quantity = Number(req.body.product_quantity);

        if (
            !product_id ||
            !Number.isInteger(product_quantity) ||
            product_quantity < 1
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "product_id and a valid numeric product_quantity are required",
                });
        }

        // Look up the product to get its current price (never trust price from the client)
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If the item is already in the cart, bump the quantity instead of duplicating it
        const existingItem = user.cart.find(
            (item) => item.product_id.toString() === product_id,
        );

        if (existingItem) {
            existingItem.product_quantity += product_quantity;
        } else {
            user.cart.push({
                product_id,
                product_quantity,
                product_price: product.price,
            });
        }

        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .select("cart")
            .populate("cart.product_id", CART_POPULATE);

        res.status(200).json({ cart: updatedUser.cart });
    } catch (error) {
        next(error);
    }
};

export const updateItemInCart = async (req, res, next) => {
    try {
        const { id } = req.params; // cart items have no _id (cartItemSchema sets _id: false); this id is the product_id
        const { action } = req.body; // expects "increase" or "decrease"

        if (!["increase", "decrease"].includes(action)) {
            return res
                .status(400)
                .json({ message: "action must be 'increase' or 'decrease'" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const item = user.cart.find(
            (item) => item.product_id.toString() === id,
        );
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        if (action === "increase") {
            item.product_quantity += 1;
        } else {
            item.product_quantity -= 1;
            if (item.product_quantity < 1) {
                // decreasing below 1 removes the item entirely
                user.cart = user.cart.filter(
                    (i) => i.product_id.toString() !== id,
                );
            }
        }

        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .select("cart")
            .populate("cart.product_id", CART_POPULATE);

        res.status(200).json({ cart: updatedUser.cart });
    } catch (error) {
        next(error);
    }
};

export const deleteItemInCart = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const itemExists = user.cart.some(
            (item) => item.product_id.toString() === id,
        );
        if (!itemExists) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        user.cart = user.cart.filter(
            (item) => item.product_id.toString() !== id,
        );
        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .select("cart")
            .populate("cart.product_id", CART_POPULATE);

        res.status(200).json({ cart: updatedUser.cart });
    } catch (error) {
        next(error);
    }
};

// Fold a guest cart (kept in the browser's localStorage) into the user's saved cart.
export const mergeCart = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res
                .status(400)
                .json({ message: "items must be an array of { product_id, product_quantity }" });
        }

        // A single malformed line must never block the whole merge, so bad entries
        // are reported back in `dropped` instead of failing the request.
        const dropped = [];
        const validItems = [];

        for (const item of items) {
            const product_id = item?.product_id;
            const product_quantity = Number(item?.product_quantity);

            if (!mongoose.isValidObjectId(product_id)) {
                dropped.push({ product_id: product_id ?? null, reason: "invalid product_id" });
                continue;
            }

            if (!Number.isInteger(product_quantity) || product_quantity < 1) {
                dropped.push({ product_id, reason: "invalid product_quantity" });
                continue;
            }

            validItems.push({ product_id, product_quantity });
        }

        if (items.length > 0 && validItems.length === 0) {
            return res.status(400).json({ message: "no valid items to merge", dropped });
        }

        if (validItems.length === 0) {
            const cart = await populateCart(req.user.id);
            return res.status(200).json({ cart, merged: 0, dropped });
        }

        // Look up the products to get their current prices (never trust price from the client)
        const products = await Product.find({
            _id: { $in: validItems.map((item) => item.product_id) },
        });
        const productsById = new Map(products.map((product) => [product._id.toString(), product]));

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let merged = 0;

        for (const { product_id, product_quantity } of validItems) {
            const product = productsById.get(product_id);

            if (!product) {
                // The product was deleted while the guest was shopping.
                dropped.push({ product_id, reason: "product not found" });
                continue;
            }

            // If the item is already in the cart, bump the quantity instead of duplicating it
            const existingItem = user.cart.find(
                (item) => item.product_id.toString() === product_id,
            );

            if (existingItem) {
                existingItem.product_quantity += product_quantity;
            } else {
                user.cart.push({
                    product_id,
                    product_quantity,
                    product_price: product.price,
                });
            }

            merged += 1;
        }

        await user.save();

        const cart = await populateCart(req.user.id);

        res.status(200).json({ cart, merged, dropped });
    } catch (error) {
        next(error);
    }
};
