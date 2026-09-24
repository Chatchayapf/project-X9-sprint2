import { CustomProduct } from "../models/customProduct.model.js";
import { Order } from "../models/order.model.js";

// ============================================
// USER-FACING
// ============================================

// Submit a new custom request. Always starts as "pending" — price is
// NOT accepted from the client here; it gets set later during approval.
export const createCustomOrder = async (req, res, next) => {
    try {
        const { name, detail, tags, deadline_date } = req.body;

        if (!detail || !detail.trim()) {
            return res.status(400).json({ message: "detail is required" });
        }

        const customProduct = await CustomProduct.create({
            name,
            detail,
            tags,
            deadline_date,
            user_id: req.user.id,
            status: "pending",
        });

        res.status(201).json(customProduct);
    } catch (error) {
        next(error);
    }
};

// Get all of my own custom requests, newest first
export const getMyCustomOrders = async (req, res, next) => {
    try {
        const customOrders = await CustomProduct.find({
            user_id: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json(customOrders);
    } catch (error) {
        next(error);
    }
};

// Get a single custom request — scoped to the logged-in user
export const getCustomOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const customProduct = await CustomProduct.findOne({
            _id: id,
            user_id: req.user.id,
        });

        if (!customProduct) {
            return res.status(404).json({ message: "Custom order not found" });
        }

        res.status(200).json(customProduct);
    } catch (error) {
        next(error);
    }
};

// Edit a draft — only allowed while still "pending".
// Once approved/rejected/ordered, the request is locked.
export const updateCustomOrderDraft = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, detail, tags, deadline_date } = req.body;

        const customProduct = await CustomProduct.findOne({
            _id: id,
            user_id: req.user.id,
        });

        if (!customProduct) {
            return res.status(404).json({ message: "Custom order not found" });
        }

        if (customProduct.status !== "pending") {
            return res.status(400).json({
                message: `Cannot edit a request that is already '${customProduct.status}'`,
            });
        }

        if (name !== undefined) customProduct.name = name;
        if (detail !== undefined) {
            if (!detail.trim()) {
                return res.status(400).json({ message: "detail cannot be empty" });
            }
            customProduct.detail = detail;
        }
        if (tags !== undefined) customProduct.tags = tags;
        if (deadline_date !== undefined) customProduct.deadline_date = deadline_date;

        await customProduct.save();

        res.status(200).json(customProduct);
    } catch (error) {
        next(error);
    }
};

// Withdraw a request — only allowed before it's been approved/rejected/ordered
export const cancelCustomOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const customProduct = await CustomProduct.findOne({
            _id: id,
            user_id: req.user.id,
        });

        if (!customProduct) {
            return res.status(404).json({ message: "Custom order not found" });
        }

        if (customProduct.status !== "pending") {
            return res.status(400).json({
                message: `Cannot cancel a request that is already '${customProduct.status}'`,
            });
        }

        await customProduct.deleteOne();

        res.status(200).json({ message: "Custom order cancelled" });
    } catch (error) {
        next(error);
    }
};

// ============================================
// ADMIN
// ============================================

// View all custom requests. Supports optional ?status= filter,
// e.g. ?status=pending to see only what needs review.
export const getAllCustomOrders = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const customOrders = await CustomProduct.find(filter)
            .populate("user_id", "name email") // adjust fields to match your User schema
            .sort({ createdAt: -1 });

        res.status(200).json(customOrders);
    } catch (error) {
        next(error);
    }
};

// Approve a request, set its price, and create its order.
export const approveCustomOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        if (typeof price !== "number" || price < 0) {
            return res
                .status(400)
                .json({ message: "A valid non-negative price is required" });
        }

        const customProduct = await CustomProduct.findOneAndUpdate(
            { _id: id, status: "pending" },
            { $set: { status: "approved", price } },
            { new: true, runValidators: true },
        );

        if (!customProduct) {
            const existingCustomProduct = await CustomProduct.findById(id);
            if (!existingCustomProduct) {
                return res.status(404).json({ message: "Custom order not found" });
            }
            return res.status(400).json({
                message: `Cannot approve a request that is already '${existingCustomProduct.status}'`,
            });
        }

        let order;
        try {
            order = await Order.create({
                order_type: "custom",
                user_id: customProduct.user_id,
                items: [
                    {
                        product_id: customProduct._id,
                        product_model: "CustomProduct",
                        quantity: 1,
                        price,
                        customization: { detail: customProduct.detail },
                    },
                ],
                total_price: price,
            });
        } catch (error) {
            customProduct.status = "pending";
            customProduct.price = undefined;
            await customProduct.save();
            throw error;
        }

        customProduct.status = "in-progress";
        await customProduct.save();

        res.status(201).json({ customOrder: customProduct, order });
    } catch (error) {
        next(error);
    }
};

// Reject a request
export const rejectCustomOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const customProduct = await CustomProduct.findById(id);

        if (!customProduct) {
            return res.status(404).json({ message: "Custom order not found" });
        }

        if (customProduct.status !== "pending") {
            return res.status(400).json({
                message: `Cannot reject a request that is already '${customProduct.status}'`,
            });
        }

        customProduct.status = "rejected";
        await customProduct.save();

        res.status(200).json(customProduct);
    } catch (error) {
        next(error);
    }
};
