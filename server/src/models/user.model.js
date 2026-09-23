import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Sub-schema สำหรับสินค้าในตะกร้า
const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  product_quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  product_price: {
    type: Number,
    required: true,
    min: 0,
  },
  _id: false,
});

// User Schema หลัก
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    birth_date: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "not specified"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    cart: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
