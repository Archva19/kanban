const { Router } = require("express");
const verifyRouter = Router();
const rateLimit = require("express-rate-limit");
const usersModel = require("../models/users.model");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/sendEmail");

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

    if (!user || user.isVerified) {
      return res.status(400).json({
        message: "Invalid verification request or code expired",
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

    const inputHashedCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    if (user.verificationCode !== inputHashedCode) {
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

      if (!user || user.isVerified) {
        return res.json({
          message: "Verification code sent successfully",
        });
      }

      const rawVerificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const hashedCode = crypto
        .createHash("sha256")
        .update(rawVerificationCode)
        .digest("hex");

      user.verificationCode = hashedCode;
      user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      try {
        await sendVerificationEmail(cleanEmail, rawVerificationCode);
      } catch (error) {
        return res.status(500).json({
          message: "Failed to send verification email",
        });
      }

      res.json({
        message: "Verification code sent successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = verifyRouter;
