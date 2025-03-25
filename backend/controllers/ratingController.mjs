import Rating from "../models/Rating.mjs";
import SPBU from "../models/SPBU.mjs";

export const addRating = async (req, res) => {
  const { spbuId, rating, review } = req.body;
  const userId = req.user.id;

  try {
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
    const ratings = await Rating.find({ spbu: spbuId }).populate("user", "name");
    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
