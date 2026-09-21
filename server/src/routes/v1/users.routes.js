import { Router } from "express";
import { User } from "../../models/user.model.js";

export const router = Router();

// get all
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// get profile
router.get("/me", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// updated profile
router.patch("/me", async (req, res, next) => {
  try {
    const {
      userId,
      firstname,
      lastname,
      birth_date,
      gender,
      username,
      email,
      password,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.birth_date = birth_date || user.birth_date;
    user.gender = gender || user.gender;
    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    next(error);
  }
});
