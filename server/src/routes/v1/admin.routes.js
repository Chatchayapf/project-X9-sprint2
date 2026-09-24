import { Router } from "express";
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js";
import { uploadImages } from "../../middlewares/upload.middleware.js";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware.js";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/admin.controller.js";

export const router = Router();

router.use(authUser, authAdmin);

router.get("/products", getAllProducts);
router.post("/products", uploadImages, createProduct);
router.patch("/products/:id", validateObjectId, uploadImages, updateProduct);
router.delete("/products/:id", validateObjectId, deleteProduct);
