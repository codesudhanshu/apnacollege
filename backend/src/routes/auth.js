const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken, setAuthCookie, clearAuthCookie, requireAuth } = require("../middleware/auth");

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (name.length < 2) return res.status(400).json({ message: "Name must be at least 2 characters." });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user._id.toString());
    setAuthCookie(res, token);
    return res.status(201).json({ user: user.toSafeJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Signup failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password." });

    const token = signToken(user._id.toString());
    setAuthCookie(res, token);
    return res.json({ user: user.toSafeJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed." });
  }
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logged out." });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ user: req.user.toSafeJSON() });
});

module.exports = router;
