const { Router } = require("express");
const authRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersModel = require("../models/users.model");

authRouter.post("/sign-up", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Full Name, Email and Password are required fields" });
  }

  const existingUser = await usersModel.findOne({ email: email });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await usersModel.create({ fullName, email, password: hashedPass });

  res.json({ message: "Registration successful" });
});

authRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required fields" });
  }

  const existingUser = await usersModel.findOne({ email: email });

  if (!existingUser) {
    return res.status(400).json({ message: "email or password is incorrect" });
  }

  const isEqualPass = await bcrypt.compare(password, existingUser.password);

  if (!isEqualPass) {
    return res.status(400).json({ message: "email or password is incorrect" });
  }

  const payload = {
    userId: existingUser._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "ტოკენი", data: token });
});

module.exports = authRouter;
