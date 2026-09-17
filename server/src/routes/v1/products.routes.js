import { Router } from "express";
import { products } from "../../fakeDB/fakeProducts.js";

export const router = Router();

router.get("/", (req, res, next) => {
  try {
    res.json(products);
  } catch (error) {
    next(error);
  }
});
