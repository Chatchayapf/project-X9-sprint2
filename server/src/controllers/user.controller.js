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
      current_password,
      password,
    } = req.body;

    // ต้อง fetch user พร้อม password field (select ออกมาเพราะปกติ select: false)
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ถ้าต้องการเปลี่ยน password
    if (password) {
      // ต้องระบุ current_password มาด้วย
      if (!current_password) {
        return res.status(400).json({
          success: false,
          message: "กรุณาระบุรหัสผ่านปัจจุบันก่อนเปลี่ยนรหัสผ่านใหม่",
        });
      }

      // ตรวจสอบว่า current_password ถูกต้องไหม
      const isMatch = await user.comparePassword(current_password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
        });
      }

      // รหัสใหม่ต้องไม่เหมือนอันเก่า
      const isSame = await user.comparePassword(password);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม",
        });
      }

      user.password = password;
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    if (birth_date !== undefined) user.birth_date = birth_date || null;
    if (gender !== undefined) user.gender = gender || user.gender;
    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        birth_date: updatedUser.birth_date,
        gender: updatedUser.gender,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
