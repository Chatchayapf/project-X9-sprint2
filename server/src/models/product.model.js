import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tag: { type: String },
    tagColor: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    details: {
      pages: { type: String },
      format: { type: String },
      language: { type: String },
      suitableFor: { type: String },
      license: { type: String },
      software: { type: String },
      lastUpdated: { type: String },
      slides: { type: String },
      editability: { type: String },
      colorScheme: { type: String },
      platform: { type: String },
      features: { type: String },
      quantity: { type: String },
      resolution: { type: String },
      usage: { type: String },
      printMethod: { type: String },
      colors: { type: String },
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product",productSchema)
