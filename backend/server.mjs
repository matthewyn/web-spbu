import express from "express";
import connectDB from "./config/db.mjs";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
