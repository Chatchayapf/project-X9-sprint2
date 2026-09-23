import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../../controllers/user.controller.js";

export const router = Router();

router.use(authUser);

// get profile
router.get("/me", getUserProfile);

// updated profile
router.patch("/me", updateUserProfile);
