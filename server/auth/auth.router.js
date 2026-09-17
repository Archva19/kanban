const { Router } = require("express");
const authRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.model");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendAlreadyRegisteredEmail,
} = require("../utils/sendEmail");

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

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (password.length > 20) {
      return res.status(400).json({
        message: "Password must be maximum 20 characters long",
      });
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
      try {
        await sendAlreadyRegisteredEmail(cleanEmail);
      } catch (error) {
        console.error(
          "Failed to send already registered email:",
          error.message,
        );
      }

      return res.json({ message: "Registration process initiated" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const rawVerificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const hashedCode = crypto
      .createHash("sha256")
      .update(rawVerificationCode)
      .digest("hex");
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser && !existingUser.isVerified) {
      const formattedName = fullName.trim().replace(/\s+/g, "+");

      existingUser.fullName = fullName;
      existingUser.password = hashedPass;
      existingUser.verificationCode = hashedCode;
      existingUser.verificationCodeExpiresAt = verificationCodeExpiresAt;
      existingUser.profilePicture = `https://ui-avatars.com/api/?name=${formattedName}&background=635FC7&color=FFFFFF`;

      await existingUser.save();
    } else {
      await usersModel.create({
        fullName,
        email: cleanEmail,
        password: hashedPass,
        isVerified: false,
        verificationCode: hashedCode,
        verificationCodeExpiresAt,
      });
    }

    try {
      await sendVerificationEmail(cleanEmail, rawVerificationCode);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return res.status(500).json({
        message: "Failed to send verification email",
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
