import express from "express";
import { addRating, getRatings, deleteRating } from "../controllers/ratingController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/", authMiddleware, addRating);
router.get("/:spbuId", getRatings);
router.delete("/:ratingId", authMiddleware, deleteRating);

export default router;
