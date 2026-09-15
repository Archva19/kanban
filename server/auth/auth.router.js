const { Router } = require("express");
const authRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.model");
const rateLimit = require("express-rate-limit");
const sendVerificationEmail = require("../utils/sendEmail");

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/sign-up", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full Name, Email and Password are required fields" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await usersModel.findOne({
      email: cleanEmail,
    });

    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    try {
      await sendVerificationEmail(cleanEmail, verificationCode);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser && !existingUser.isVerified) {
      existingUser.fullName = fullName;
      existingUser.password = hashedPass;
      existingUser.verificationCode = verificationCode;
      existingUser.verificationCodeExpiresAt = verificationCodeExpiresAt;
      await existingUser.save();
    } else {
      await usersModel.create({
        fullName,
        email: cleanEmail,
        password: hashedPass,
        isVerified: false,
        verificationCode,
        verificationCodeExpiresAt,
      });
    }

    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

authRouter.post("/sign-in", signInLimiter, async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    if (!existingUser.password) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    const isEqualPass = await bcrypt.compare(password, existingUser.password);

    if (!isEqualPass) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    if (!existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const payload = {
      userId: existingUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

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
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

authRouter.post("/guest-sign-in", signInLimiter, async (req, res) => {
  try {
    const guestUser = await usersModel.create({
      fullName: "Guest User",
      email: `guest_${Date.now()}@kanban.temp`,
      isGuest: true,
    });

    const payload = { userId: guestUser._id, isGuest: true };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ message: "Guest login is successful", data: token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = authRouter;
