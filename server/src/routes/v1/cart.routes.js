import { Router } from "express";
import { User } from "../../models/user.model";

const router = Router();

// Get cart from database and sent to frontend.
router.get("/cart", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("cart")
      .populate("cart.product_id", "name price image"); // pull in product details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
});

// Add item to cart.
router.post("/cart/items", requireAuth, async (req, res, next) => {
  try {
    const { product_id, product_quantity } = req.body;

    if (!product_id || !product_quantity || product_quantity < 1) {
      return res.status(400).json({ message: "product_id and a valid product_quantity are required" });
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
      (item) => item.product_id.toString() === product_id
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
      .populate("cart.product_id", "name price image");

    res.status(200).json({ cart: updatedUser.cart });
  } catch (error) {
    next(error);
  }
});

// Update item in cart (increase, decrease).
router.patch("/cart/items/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params; // this is the cart sub-document's _id... but your schema sets _id: false on cartItemSchema, see note below
    const { action } = req.body; // expects "increase" or "decrease"

    if (!["increase", "decrease"].includes(action)) {
      return res.status(400).json({ message: "action must be 'increase' or 'decrease'" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = user.cart.find((item) => item.product_id.toString() === id);
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
          (i) => i.product_id.toString() !== id
        );
      }
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select("cart")
      .populate("cart.product_id", "name price image");

    res.status(200).json({ cart: updatedUser.cart });
  } catch (error) {
    next(error);
  }
});

// Delete item in cart.
router.delete("/cart/items/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemExists = user.cart.some(
      (item) => item.product_id.toString() === id
    );
    if (!itemExists) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    user.cart = user.cart.filter((item) => item.product_id.toString() !== id);
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select("cart")
      .populate("cart.product_id", "name price image");

    res.status(200).json({ cart: updatedUser.cart });
  } catch (error) {
    next(error);
  }
});