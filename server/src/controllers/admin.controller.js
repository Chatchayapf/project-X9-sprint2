import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";

const buildProductData = (body) => {
  const data = {};
  for (const key of ["name", "description", "date", "tag", "tagColor"]) {
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

const cleanupImages = async (urls) => {
  await Promise.allSettled(urls.map((url) => deleteImage(url)));
};

const handleImageUpload = async (req) => {
  const img_urls = [];
  try {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const url = await uploadImage(dataURI);
        img_urls.push(url);
      }
    }
    return img_urls;
  } catch (error) {
    await cleanupImages(img_urls);
    throw error;
  }
};

const parseRemoveImages = (value) => {
  if (value === undefined || value === "") return [];

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (
      !Array.isArray(parsed) ||
      parsed.some((image) => typeof image !== "string" || !image.trim())
    ) {
      return null;
    }
    return [...new Set(parsed)];
  } catch {
    return null;
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const orderFilter = {
      order_type: "standard",
      payment_status: "paid",
      order_status: { $ne: "cancelled" },
    };

    const [revenueResult, productSales, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: orderFilter },
        { $group: { _id: null, totalRevenue: { $sum: "$total_price" } } },
      ]),
      Order.aggregate([
        { $match: orderFilter },
        { $unwind: "$items" },
        { $match: { "items.product_model": "Product" } },
        {
          $group: {
            _id: "$items.product_id",
            sold: { $sum: "$items.quantity" },
          },
        },
      ]),
      Product.countDocuments({}),
    ]);

    const productSalesMap = Object.fromEntries(
      productSales.map((item) => [item._id.toString(), item.sold]),
    );
    const totalSales = productSales.reduce((sum, item) => sum + item.sold, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        totalSales,
        totalProducts,
        productSales: productSalesMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  let uploadedImages = [];
  try {
    const productData = buildProductData(req.body);
    uploadedImages = await handleImageUpload(req);

    if (uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A product must have at least one image",
      });
    }

    productData.img_url = uploadedImages;
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    await cleanupImages(uploadedImages);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  let uploadedImages = [];
  let productUpdated = false;

  try {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existingImages = Array.isArray(existingProduct.img_url)
      ? existingProduct.img_url
      : existingProduct.img_url
        ? [existingProduct.img_url]
        : [];
    const imagesToRemove = parseRemoveImages(req.body.removeImages);
    if (imagesToRemove === null) {
      return res.status(400).json({
        success: false,
        message: "removeImages must be a valid list of image URLs",
      });
    }

    const existingImageSet = new Set(existingImages);
    if (imagesToRemove.some((image) => !existingImageSet.has(image))) {
      return res.status(400).json({
        success: false,
        message: "One or more images do not belong to this product",
      });
    }

    const removalSet = new Set(imagesToRemove);
    const retainedImages = existingImages.filter((image) => !removalSet.has(image));
    const newImageCount = req.files?.length || 0;
    const finalImageCount = retainedImages.length + newImageCount;

    if (finalImageCount > 5) {
      return res.status(400).json({
        success: false,
        message: "A product can have at most 5 images",
      });
    }

    if (finalImageCount === 0) {
      return res.status(400).json({
        success: false,
        message: "A product must have at least one image",
      });
    }

    const productData = buildProductData(req.body);
    uploadedImages = await handleImageUpload(req);
    productData.img_url = [...retainedImages, ...uploadedImages];

    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      await cleanupImages(uploadedImages);
      uploadedImages = [];
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    productUpdated = true;
    await cleanupImages(imagesToRemove);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (!productUpdated) await cleanupImages(uploadedImages);
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
