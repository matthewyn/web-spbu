import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = await User.findById(decoded.id).select("-password"); // Populate req.user
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
