import { Router } from "express";
// import { products } from "../../fakeDB/fakeProducts.js";
import { Product } from "../../models/product.model.js";

export const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find()
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});
