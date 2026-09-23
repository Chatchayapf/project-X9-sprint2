import { Product } from "../models/product.model.js";

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    
    // Build query object
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (type && type !== "All type") {
      query.tag = type;
    }

    const products = await Product.find(query);
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
