import { Router } from "express";
import { authUser,authAdmin  } from "../../middlewares/auth.middleware.js";
import {
    createCustomOrder,
    getMyCustomOrders,
    getCustomOrderById,
    updateCustomOrderDraft,
    cancelCustomOrder,
    getAllCustomOrders,
    approveCustomOrder,
    rejectCustomOrder,
} from "../../controllers/customOrder.controller.js";

export const router = Router();

// ============================================
// USER-FACING
// ============================================

// Submit a new custom request (status: "pending", no price yet)
router.post("/", authUser, createCustomOrder);

// View all of my own custom requests
router.get("/", authUser, getMyCustomOrders);

// View one of my custom requests
router.get("/:id", authUser, getCustomOrderById);

// Edit detail/tags/deadline while still "pending"
router.patch("/:id", authUser, updateCustomOrderDraft);

// Withdraw a request before it's been approved/rejected
router.delete("/:id", authUser, cancelCustomOrder);

// ============================================
// ADMIN
// ============================================

// View all custom requests, optionally ?status=pending
router.get("/admin/all", authUser, authAdmin, getAllCustomOrders);

// Approve a request and set its price
router.patch("/:id/approve", authUser, authAdmin, approveCustomOrder);

// Reject a request
router.patch("/:id/reject", authUser, authAdmin, rejectCustomOrder);