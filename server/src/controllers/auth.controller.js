import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = (maxAge) => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };
};

export const register = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      birth_date,
      gender,
      username,
      email,
      password,
    } = req.body;

    const user = await User.create({
      firstname,
      lastname,
      birth_date,
      gender,
      username,
      email,
      password,
    });

    const accessToken = generateAccessToken(user._id);
    res.cookie(
      "accessToken",
      accessToken,
      cookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        birth_date: user.birth_date,
        gender: user.gender,
        username: user.username,
        email: user.email,
        role: user.role,
        cart: user.cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username/email and password",
      });
    }

    const identifier = email.trim();
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    const accessToken = generateAccessToken(user._id);
    res.cookie(
      "accessToken",
      accessToken,
      cookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        birth_date: user.birth_date,
        gender: user.gender,
        username: user.username,
        email: user.email,
        role: user.role,
        cart: user.cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      path: "/",
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
