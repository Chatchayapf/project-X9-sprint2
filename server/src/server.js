import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { router as apiRoutes } from "./routes/index.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());

app.use("/api", apiRoutes);
app.use((err, req, res, next) => {
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
