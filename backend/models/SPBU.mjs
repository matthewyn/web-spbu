import mongoose from "mongoose";

const SPBUSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  open: {
    type: String,
    required: true,
  },
  close: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  ratingSum: {
    type: Number,
    default: 0,
  },
});

const SPBU = mongoose.model("SPBU", SPBUSchema);
export default SPBU;
