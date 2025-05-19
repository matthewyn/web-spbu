import Rating from "../models/Rating.mjs";
import SPBU from "../models/SPBU.mjs";

const recalculateRatings = async (spbuId) => {
  const ratings = await Rating.find({ spbu: spbuId });
  const ratingCount = ratings.length;
  const ratingSum = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

  await SPBU.findByIdAndUpdate(spbuId, {
    ratingCount,
    ratingSum,
    averageRating,
  });
};

export const addRating = async (req, res) => {
  const { spbuId, rating, review } = req.body;
  const userId = req.user.id;

  try {
    // Check if the user has already submitted a review for this SPBU
    const existingRating = await Rating.findOne({ user: userId, spbu: spbuId });
    if (existingRating) {
      return res.status(400).json({ message: "You have already submitted a review for this SPBU." });
    }

    const newRating = new Rating({
      user: userId,
      spbu: spbuId,
      rating,
      review,
    });

    await newRating.save();

    // Update SPBU average rating and rating count
    const spbu = await SPBU.findById(spbuId);
    spbu.ratingCount += 1;
    spbu.ratingSum += rating;
    spbu.averageRating = spbu.ratingSum / spbu.ratingCount;
    await spbu.save();

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getRatings = async (req, res) => {
  const { spbuId } = req.params;

  try {
    const ratings = await Rating.find({ spbu: spbuId }).populate("user", "name _id");
    res.json(ratings);
  } catch (err) {
    console.error("Error fetching ratings:", err);
    res.status(500).send("Server error");
  }
};

export const deleteRating = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const spbuId = rating.spbu;
    await rating.remove();

    // Recalculate ratings for the SPBU
    await recalculateRatings(spbuId);

    res.status(200).json({ message: "Rating deleted and SPBU ratings recalculated" });
  } catch (err) {
    console.error("Error deleting rating:", err);
    res.status(500).json({ message: "Server error" });
  }
};
