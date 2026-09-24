const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const invitationsModel = require("../models/invitations.model");
const isAuth = require("../middlewares/isAuth.middleware");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");
const invitationsRouter = Router();
const { getIO } = require("../socket");

invitationsRouter.get("/me", isAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const invitations = await invitationsModel
      .find({ recipient: userId, status: "pending" })
      .populate("board", "title")
      .populate("sender", "fullName email profilePicture");
    res.json({ message: "Invitations fetched", data: invitations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

invitationsRouter.patch("/:id/accept", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const invitation = await invitationsModel.findOne({
      _id: id,
      recipient: userId,
      status: "pending",
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    const targetBoard = await boardsModel.findById(invitation.board);
    if (!targetBoard) {
      invitation.status = "rejected";
      await invitation.save();
      return res.status(404).json({ message: "The board no longer exists" });
    }

    invitation.status = "accepted";
    await invitation.save();

    const updatedBoard = await boardsModel
      .findByIdAndUpdate(
        invitation.board,
        { $addToSet: { collaborators: userId } },
        { new: true },
      )
      .populate("owner", "fullName email profilePicture")
      .populate("collaborators", "fullName email profilePicture")
      .populate({
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      });

    await usersModel.findByIdAndUpdate(userId, {
      $addToSet: { boards: invitation.board },
    });

    getIO().to(`board:${invitation.board}`).emit("board_updated", updatedBoard);
    getIO()
      .to(`user:${userId}`)
      .emit("invitation_accepted", { invitationId: id });

    res.json({ message: "Invitation accepted", data: updatedBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

invitationsRouter.patch("/:id/reject", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const invitation = await invitationsModel.findOne({
      _id: id,
      recipient: userId,
      status: "pending",
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    invitation.status = "rejected";
    await invitation.save();

    getIO()
      .to(`user:${userId}`)
      .emit("invitation_rejected", { invitationId: id });

    res.json({ message: "Invitation rejected", data: invitation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = invitationsRouter;
