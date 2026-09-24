import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { CustomProduct } from "../models/customProduct.model.js";
import { User } from "../models/user.model.js";

// ============================================
// Checkout: standard cart items
// (unchanged from before)
// ============================================
export const checkoutNormalItems = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.cart.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const items = [];
        let totalPrice = 0;

        for (const cartItem of user.cart) {
            const product = await Product.findById(cartItem.product_id);
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${cartItem.product_id}`,
                });
            }
            if (product.quantity < cartItem.product_quantity) {
                return res
                    .status(400)
                    .json({ message: `Insufficient stock for ${product.name}` });
            }

            const price = product.price;
            totalPrice += price * cartItem.product_quantity;

            items.push({
                product_id: cartItem.product_id,
                product_model: "Product",
                quantity: cartItem.product_quantity,
                price,
            });
        }

        const order = await Order.create({
            order_type: "standard",
            user_id: user._id,
            items,
            total_price: totalPrice,
        });

        user.cart = [];
        await user.save();

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// ============================================
// Checkout: custom item
// Now only turns an ALREADY-APPROVED CustomProduct into an Order.
// It does NOT create a CustomProduct anymore — that happens in
// customOrder.routes.js (createCustomOrder), and approval (with price)
// happens via customOrder.routes.js's approveCustomOrder.
// ============================================
export const checkoutCustomItems = async (req, res, next) => {
    try {
        const { custom_product_id } = req.body;

        if (!custom_product_id) {
            return res
                .status(400)
                .json({ message: "custom_product_id is required" });
        }

        const customProduct = await CustomProduct.findById(custom_product_id);

        if (!customProduct) {
            return res.status(404).json({ message: "Custom product not found" });
        }

        // Ownership check — prevent checking out someone else's custom request
        if (customProduct.user_id.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Not authorized to checkout this item" });
        }

        // Must be approved before it can be ordered
        if (customProduct.status !== "approved") {
            return res.status(400).json({
                message: `Custom item is not approved for checkout (current status: ${customProduct.status})`,
            });
        }

        // Price must have been set during approval
        if (typeof customProduct.price !== "number") {
            return res
                .status(400)
                .json({ message: "Custom item has no price set" });
        }

        const order = await Order.create({
            order_type: "custom",
            user_id: req.user.id,
            items: [
                {
                    product_id: customProduct._id,
                    product_model: "CustomProduct",
                    quantity: 1,
                    price: customProduct.price,
                    customization: { detail: customProduct.detail },
                },
            ],
            total_price: customProduct.price,
        });

        // Mark as in-progress so it can't be checked out twice.
        // Reuses the existing "in-progress" enum value — no schema change needed.
        customProduct.status = "in-progress";
        await customProduct.save();

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};