import { Product } from "../models/product.model.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";

const buildProductData = (body) => {
  const data = {};
  for (const key of ["name", "description", "tag", "tagColor"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  for (const key of ["price", "quantity", "rating", "reviews"]) {
    if (body[key] !== undefined) {
      const num = Number(body[key]);
      if (!Number.isNaN(num)) data[key] = num;
    }
  }
  if (body.details) {
    data.details = typeof body.details === "string" ? JSON.parse(body.details) : body.details;
  }
  return data;
};

const handleImageUpload = async (req) => {
  const img_urls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const url = await uploadImage(dataURI);
      img_urls.push(url);
    }
  }
  return img_urls;
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = buildProductData(req.body);
    productData.img_url = await handleImageUpload(req);

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productData = buildProductData(req.body);
    const newImages = await handleImageUpload(req);

    if (newImages.length > 0) {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      productData.img_url = [...existingProduct.img_url, ...newImages];
    }

    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.img_url && product.img_url.length > 0) {
      for (const url of product.img_url) {
        await deleteImage(url);
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
