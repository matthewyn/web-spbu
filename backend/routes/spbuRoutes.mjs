import express from "express";
import SPBU from "../models/SPBU.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const spbuData = await SPBU.find();
    res.json(spbuData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
