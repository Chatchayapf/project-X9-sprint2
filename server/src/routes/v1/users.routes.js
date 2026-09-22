import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware";
import {
  getUserProfile,
  updateUserProfile,
} from "../../controllers/user.controller";

export const router = Router();

router.use(authUser);

// get profile
router.get("/me", getUserProfile);

// updated profile
router.patch("/me", updateUserProfile);
