import { Router } from "express";
// import { products } from "../../fakeDB/fakeProducts.js";
import { Product } from "../../models/product.model.js";

export const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});
