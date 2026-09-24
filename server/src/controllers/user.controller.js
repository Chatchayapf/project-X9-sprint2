import { User } from "../models/user.model.js";

export const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
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

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
      success: true,
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      birth_date: updatedUser.birth_date,
      gender: updatedUser.gender,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    next(error);
  }
};
