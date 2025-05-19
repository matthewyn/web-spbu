import mongoose from "mongoose";
import SPBU from "./models/SPBU.mjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const resetRatings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Reset ratings for all SPBU
    await SPBU.updateMany({}, { averageRating: 0, ratingCount: 0, ratingSum: 0 });
    console.log("Ratings reset for all SPBU");

    // Close the connection
    mongoose.connection.close();
    console.log("Connection closed");
  } catch (err) {
    console.error("Error resetting ratings:", err);
    mongoose.connection.close();
  }
};

resetRatings();