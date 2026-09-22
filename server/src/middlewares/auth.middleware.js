import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authUser = async (req, res, next) => {
  let token = req.cookies.accessToken;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Access denied. No token!" });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeToken.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const authAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only!",
    });
  }
};
