import { Router } from "express";
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js";
import {
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
} from "../../controllers/order.controller.js";

export const router = Router();

// ============================================
// USER-FACING
// ============================================

// Get all of my orders
router.get("/", authUser, getMyOrders);

// Get one of my orders by id
router.get("/:id", authUser, getOrderById);

// Cancel one of my orders (only while pending/processing)
router.patch("/:id/cancel", authUser, cancelOrder);

// ============================================
// ADMIN
// ============================================

// Get all orders (optionally ?order_status=&payment_status=)
router.get("/admin/all", authUser, authAdmin, getAllOrders);

// Update an order's fulfillment status
router.patch("/:id/status", authUser, authAdmin, updateOrderStatus);

// Update an order's payment status
router.patch("/:id/payment", authUser, authAdmin, updatePaymentStatus);
