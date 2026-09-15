const { Router } = require("express");
const verifyRouter = Router();
const rateLimit = require("express-rate-limit");
const sendVerificationEmail = require("../utils/sendEmail");
const usersModel = require("../models/users.model");

const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many verification attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

verifyRouter.post("/verify-email", verificationLimiter, async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    const user = await usersModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (
      !user.verificationCodeExpiresAt ||
      user.verificationCodeExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Verification code has expired",
      });
    }

    if (user.verificationCode !== code.trim()) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

verifyRouter.post(
  "/resend-verification",
  verificationLimiter,
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const cleanEmail = email.toLowerCase().trim();

      const user = await usersModel.findOne({
        email: cleanEmail,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          message: "Email is already verified",
        });
      }

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      try {
        await sendVerificationEmail(cleanEmail, verificationCode);
      } catch (error) {
        return res.status(500).json({
          message: "Failed to send verification email",
        });
      }

      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      res.json({
        message: "Verification code sent successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = verifyRouter;
