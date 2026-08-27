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
      .json({ message: "Full Name, Email and Password are required field" });
  }

  const existingUser = await usersModel.findOne({ email: email });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "ასეთი მომხმარებელი უკვე არსებობს" });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await usersModel.create({ fullName, email, password: hashedPass });

  res.json({ message: "რეგისტრაცია წარმატებულია" });
});

authRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required field" });
  }

  const existingUser = await usersModel.findOne({ email: email });

  if (!existingUser) {
    return res.status(400).json({ message: "ასეთი მომხმარებელი არ არსებობს" });
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
