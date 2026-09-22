import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { router as apiRoutes } from "./routes/index.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRoutes);
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: "Conflict",
      message: "Email or username already exists",
    });
  }

  return res.status(500).json({
    error: "Something went wrong on the server...",
    message: err.message,
  });
});

const PORT = process.env.PORT;
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT:${PORT}`);
    });
  } catch (error) {
    console.log("Fail to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
