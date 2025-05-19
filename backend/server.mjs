import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath to define __dirname
import connectDB from "./config/db.mjs";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import spbuRoutes from "./routes/spbuRoutes.mjs";
import ratingRoutes from "./routes/ratingRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import dotenv from "dotenv";
dotenv.config();

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/spbu", spbuRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"))); // Serve static files

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
