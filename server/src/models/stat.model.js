import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "product_model",
    },
    product_model: {
      type: String,
      required: true,
      enum: ["Product", "CustomProduct"],
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    sell_date: {
      type: Date,
      default: Date.now,
    },
    total_unit_sell: {
      type: Number,
      required: true,
      min: 1,
    },
    total_revenue: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Stat = mongoose.model("Stat", statSchema);
