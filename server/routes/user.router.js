const { Router } = require("express");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");
const isAuth = require("../middlewares/isAuth.middleware");
const boardsModel = require("../models/boards.model");
const invitationsModel = require("../models/invitations.model");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const usersRouter = Router();

usersRouter.get("/me", isAuth, async (req, res) => {
  try {
    const user = await usersModel
      .findById(req.userId)
      .select("-password")
      .populate({
        path: "boards",
        populate: [
          { path: "owner", select: "fullName email profilePicture" },
          { path: "collaborators", select: "fullName email profilePicture" },
          {
            path: "columns.tasks.assignee",
            select: "fullName email profilePicture",
          },
        ],
      });

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

usersRouter.delete("/me", isAuth, async (req, res) => {
  try {
    const id = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "invalid id", data: null });
    }

    const userBoards = await boardsModel.find({ owner: id }).select("_id");
    const userBoardIds = userBoards.map((board) => board._id);

    await invitationsModel.deleteMany({
      $or: [
        { sender: id },
        { recipient: id },
        { board: { $in: userBoardIds } },
      ],
    });

    await boardsModel.deleteMany({ owner: id });

    await boardsModel.updateMany(
      { $or: [{ collaborators: id }, { "columns.tasks.assignee": id }] },
      {
        $pull: { collaborators: id },
        $set: { "columns.$[col].tasks.$[task].assignee": null },
      },
      {
        arrayFilters: [
          { "col.tasks": { $exists: true } },
          { "task.assignee": id },
        ],
      },
    );

    const deletedUser = await usersModel
      .findByIdAndDelete(id)
      .select("-password");

    res.json({
      message: "მომხმარებელი წაიშალა წარმატებით",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

usersRouter.patch("/profilePicture", isAuth, async (req, res) => {
  try {
    const id = req.userId;
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res
        .status(400)
        .json({ message: "profilePicture URL is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
      folder: "avatars",
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    });

    const updatedUser = await usersModel
      .findByIdAndUpdate(
        id,
        { profilePicture: uploadResponse.secure_url },
        { new: true },
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

usersRouter.patch("/profilePictureDelete", isAuth, async (req, res) => {
  try {
    const id = req.userId;

    const user = await usersModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedName = user.fullName
      ? user.fullName.trim().replace(/\s+/g, "+")
      : "User";
    const defaultAvatar = `https://ui-avatars.com/api/?name=${formattedName}&background=635FC7&color=FFFFFF`;

    const updatedUser = await usersModel
      .findByIdAndUpdate(id, { profilePicture: defaultAvatar }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

usersRouter.patch("/fullName", isAuth, async (req, res) => {
  try {
    const id = req.userId;
    const { fullName } = req.body;

    if (fullName === undefined || fullName === null) {
      return res
        .status(400)
        .json({ message: "Full Name parameter is required" });
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

    const updatedUser = await usersModel
      .findByIdAndUpdate(
        id,
        { fullName: fullName.trim(), profilePicture: updatedProfile },
        { new: true },
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = usersRouter;
