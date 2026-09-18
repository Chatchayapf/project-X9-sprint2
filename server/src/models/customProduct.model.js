import mongoose from "mongoose";

// Schema สำหรับ Custom Product
const customProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    detail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "in-progress", "completed"],
      default: "pending",
      required: true,
    },
    deadline_date: {
      type: Date,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CustomProduct = mongoose.model(
  "CustomProduct",
  customProductSchema,
);
