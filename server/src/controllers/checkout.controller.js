import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { CustomProduct } from "../models/customProduct.model.js"

// Checkout: create an order from the user's cart, then clear the cart
export const checkoutNormalItems = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("cart");
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.cart.length)
            return res.status(400).json({ message: "Cart is empty" });

        const items = [];
        let totalPrice = 0;

        for (const cartItem of user.cart) {
            const product = await Product.findById(cartItem.product_id);
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${cartItem.product_id}`,
                });
            }
            totalPrice += product.price * cartItem.product_quantity;
            items.push({
                product_id: cartItem.product_id,
                product_model: "Product",
                quantity: cartItem.product_quantity,
                price: product.price,
            });
        }

        const order = await Order.create({
            user_id: user._id,
            items,
            total_price: totalPrice,
        });

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Checkout Custom item
export const checkoutCustomItems = async (req, res, next) => {
  try {
    const { name, detail, tags } = req.body; // custom item data from frontend

    if (!detail) {
      return res.status(400).json({ message: "detail is required" });
    }

    const customItem = await CustomProduct.create({
      name,
      detail,
      tags,
      user_id: req.user.id,
      status: "pending", // still needs review — price is NOT trusted from client
    });

    const CUSTOM_ITEM_PRICE = 500; // server-controlled, not from req.body

    const order = await Order.create({
      order_type: "custom",
      user_id: req.user.id,
      items: [{
        product_id: customItem._id,
        product_model: "CustomProduct",
        quantity: 1,
        price: CUSTOM_ITEM_PRICE,
        customization: { detail: customItem.detail },
      }],
      total_price: CUSTOM_ITEM_PRICE,
      payment_status: "pending", // don't mark paid until you actually confirm payment
    });

    res.status(200).json({ customItem, order });
  } catch (error) {
    next(error);
  }
};