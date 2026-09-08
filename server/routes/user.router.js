const { Router } = require("express");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");
const isAuth = require("../middlewares/isAuth.middleware");
const boardsModel = require("../models/boards.model");

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const findAllUser = await usersModel.find();
  res.json({
    message: "გილოცავ შენ წარმატებით წამოიღე ინფორმაცია ბაზიდან",
    data: findAllUser,
  });
});

usersRouter.get("/me", isAuth, async (req, res) => {
  try {
    const user = await usersModel
      .findById(req.userId)
      .select("-password")
      .populate("boards");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({
      message: "successfully fetched user data",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

usersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "invalid id", data: null });
  }
  const findUserById = await usersModel.findById(id).select("-password");
  res.json({
    message: "გილოცავ შენ წარმატებით წამოიღე ინფორმაცია აიდის მიხედვით",
    data: findUserById,
  });
});

// usersRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   if (!isValidObjectId(id)) {
//     return res.status(400).json({ message: "invalid id", data: null });
//   }

//   await boardsModel.deleteMany({ user: id });
//   const findUserBydId = await usersModel.findByIdAndDelete(id);

//   res.json({
//     message: "მომხმარებელი წაიშალა წარმატებით",
//     data: findUserBydId,
//   });
// });

usersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fullName, email } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "invalid id", data: null });
  }

  const findUserByIdAndUpdate = await usersModel.findByIdAndUpdate(
    id,
    { fullName, email },
    { new: true },
  );
  res.json({
    message: "გილოცავ შენ წარმატებით განაახლე მონაცემი",
    data: findUserByIdAndUpdate,
  });
});

usersRouter.delete("/:id", isAuth, async (req, res) => {
  const id = req.userId;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "invalid id", data: null });
  }

  await boardsModel.deleteMany({ user: id });
  const findUserBydId = await usersModel.findByIdAndDelete(id);

  res.json({
    message: "მომხმარებელი წაიშალა წარმატებით",
    data: findUserBydId,
  });
});

usersRouter.patch("/profilePicture", isAuth, async (req, res) => {
  const id = req.userId;
  const { profilePicture } = req.body;

  if (!profilePicture) {
    return res.status(400).json({ message: "profilePicture URL is required" });
  }

  const updatedUser = await usersModel.findOneAndUpdate(
    { _id: id },
    { profilePicture },
    { new: true },
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User updated", data: updatedUser });
});

usersRouter.patch("/profilePictureDelete", isAuth, async (req, res) => {
  const id = req.userId;

  const user = await usersModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const formattedName = user.fullName
    ? user.fullName.trim().replace(/\s+/g, "+")
    : "User";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${formattedName}&background=635FC7&color=FFFFFF`;

  const updatedUser = await usersModel.findOneAndUpdate(
    { _id: id },
    { profilePicture: defaultAvatar },
    { new: true },
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User updated", data: updatedUser });
});

usersRouter.patch("/fullName", isAuth, async (req, res) => {
  const id = req.userId;
  const { fullName } = req.body;

  if (fullName === undefined || fullName === null) {
    return res.status(400).json({ message: "Full Name parameter is required" });
  }

  const user = await usersModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const formattedName = fullName.trim().replace(/\s+/g, "+");
  const defaultAvatar = `https://ui-avatars.com/api/?name=${formattedName}&background=635FC7&color=FFFFFF`;

  const updatedProfile = user.profilePicture?.includes("ui-avatars.com")
    ? defaultAvatar
    : user.profilePicture;

  const updatedUser = await usersModel.findOneAndUpdate(
    { _id: id },
    { fullName, profilePicture: updatedProfile },
    { new: true },
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User updated", data: updatedUser });
});

module.exports = usersRouter;
