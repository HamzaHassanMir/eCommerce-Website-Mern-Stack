import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ FIX: Wrapped in try/catch — was missing, any DB error would crash unhandled
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ FIX: Check if user already exists before creating
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Registered successfully", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during registration");
  }
});

// ✅ FIX: Wrapped in try/catch — was missing
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    // ✅ FIX: Added expiry to JWT — was missing, token lived forever
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during login");
  }
});

export default router;
