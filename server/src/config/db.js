import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MongoDB_URI is not set in the environment");
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected ✅");
}
