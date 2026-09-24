import { Order } from "../models/order.model.js";

// ============================================
// USER-FACING ROUTES
// ============================================

// Get all orders belonging to the logged-in user
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user_id: req.user.id })
            .populate("items.product_id")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Get a single order by id — scoped to the logged-in user so no one
// can fetch someone else's order by guessing an ObjectId
export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user_id: req.user.id,
        }).populate("items.product_id");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Cancel an order — only allowed while it hasn't shipped yet.
// NOTE: this does not restore product stock. If you decrement stock at
// checkout time, add that restoration logic here before saving.
export const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({ _id: id, user_id: req.user.id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!["pending", "processing"].includes(order.order_status)) {
            return res.status(400).json({
                message: `Cannot cancel an order that is already '${order.order_status}'`,
            });
        }

        order.order_status = "cancelled";
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// ============================================
// ADMIN ROUTES
// ============================================

// Get all orders across all users, newest first.
// Supports optional ?order_status= and ?payment_status= filters.
export const getAllOrders = async (req, res, next) => {
    try {
        const { order_status, payment_status } = req.query;
        const filter = {};

        if (order_status) filter.order_status = order_status;
        if (payment_status) filter.payment_status = payment_status;

        const orders = await Order.find(filter)
            .populate("items.product_id")
            .populate("user_id", "name email") // adjust fields to match your User schema
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const VALID_ORDER_STATUSES = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

// Admin: update an order's fulfillment status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;

        if (!VALID_ORDER_STATUSES.includes(order_status)) {
            return res.status(400).json({
                message: `order_status must be one of: ${VALID_ORDER_STATUSES.join(", ")}`,
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { order_status },
            { new: true, runValidators: true },
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

// Admin: update an order's payment status
export const updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        if (!VALID_PAYMENT_STATUSES.includes(payment_status)) {
            return res.status(400).json({
                message: `payment_status must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}`,
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { payment_status },
            { new: true, runValidators: true },
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};