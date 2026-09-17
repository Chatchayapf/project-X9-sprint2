import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello")
})

const PORT=process.env.PORT
async function start() {
    try {
    await connectDB()
    app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`)
}) 
    } catch (error) {
        console.log("Fail to connect to MongoDB:", error.message)
        process.exit(1)
    }    
}

start()