const { Router } = require("express");
const usersModel = require("../models/users.model");
const passwordResetRouter = Router();
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message:
      "Too many password reset attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

passwordResetRouter.post(
  "/forgot-password",
  passwordResetLimiter,
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const cleanEmail = email.toLowerCase().trim();
      const user = await usersModel.findOne({ email: cleanEmail });

      if (!user || !user.isVerified) {
        return res.json({
          message:
            "If an account with this email exists, a reset link has been sent.",
        });
      }

      const rawResetToken = crypto.randomBytes(32).toString("hex");
      const hashedResetToken = crypto
        .createHash("sha256")
        .update(rawResetToken)
        .digest("hex");

      user.resetPasswordToken = hashedResetToken;
      user.resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
      const resetUrl = `${frontendUrl}/reset-password?token=${rawResetToken}&email=${cleanEmail}`;

      try {
        await sendResetPasswordEmail(cleanEmail, resetUrl);
      } catch (error) {
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      res.json({
        message:
          "If an account with this email exists, a reset link has been sent.",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

passwordResetRouter.post(
  "/reset-password",
  passwordResetLimiter,
  async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;

      if (!email || !token || !newPassword) {
        return res.status(400).json({
          message: "Email, token, and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }

      if (newPassword.length > 20) {
        return res.status(400).json({
          message: "Password must be maximum 20 characters long",
        });
      }

      const cleanEmail = email.toLowerCase().trim();
      const hashedToken = crypto
        .createHash("sha256")
        .update(token.toString().trim())
        .digest("hex");

      const user = await usersModel.findOne({
        email: cleanEmail,
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpiresAt = null;

      await user.save();

      res.json({ message: "Password reset successful. You can now sign in." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = passwordResetRouter;
