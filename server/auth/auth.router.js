const { Router } = require("express");
const authRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.model");
const rateLimit = require("express-rate-limit");

// const signInLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: {
//     message: "Too many login attempts, please try again after 15 minutes.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

authRouter.post("/sign-up", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Full Name, Email and Password are required fields" });
  }

  const existingUser = await usersModel.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await usersModel.create({
    fullName,
    email: email.toLowerCase().trim(),
    password: hashedPass,
  });

  res.json({ message: "Registration successful" });
});

authRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required fields" });
  }

  const existingUser = await usersModel.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!existingUser) {
    return res.status(400).json({ message: "Email or Password is incorrect" });
  }

  const isEqualPass = await bcrypt.compare(password, existingUser.password);

  if (!isEqualPass) {
    return res.status(400).json({ message: "Email or Password is incorrect" });
  }

  const payload = {
    userId: existingUser._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  res.json({
    message: "ტოკენი",
    data: token,
    user: {
      id: existingUser._id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      profilePicture: existingUser.profilePicture || "",
    },
  });
});

authRouter.post("/guest-sign-in", async (req, res) => {
  const guestUser = await usersModel.create({
    fullName: "Guest User",
    email: `guest_${Date.now()}@kanban.temp`,
    isGuest: true,
  });

  const payload = { userId: guestUser._id, isGuest: true };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  res.json({ message: "Guest login is successful", data: token });
});

module.exports = authRouter;
