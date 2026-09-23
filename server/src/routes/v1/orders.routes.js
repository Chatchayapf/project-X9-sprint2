import { Router } from "express";

export const router = Router();

// User side
// Get order list
router.get("/", authUser, getMyOrders);              // user's own order history

// Get one order 
router.get("/:id", authUser, getOrderById);          // single order detail (verify ownership!)

// Cancle order 
router.patch("/:id/cancel", authUser, cancelOrder);  // user cancels while still "pending"/"processing"

// Admin side
// Get all order list
router.get("/admin/all", authAdmin, getAllOrders);

// Update order status
router.patch("/:id/status", authAdmin, updateOrderStatus);   // pending -> processing -> shipped -> delivered

// Update payment status
router.patch("/:id/payment", authAdmin, updatePaymentStatus); // pending -> paid/failed/refunded