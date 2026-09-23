const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const isAuth = require("../middlewares/isAuth.middleware");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");
const invitationsModel = require("../models/invitations.model");
const boardsRouter = Router();

boardsRouter.post("/", isAuth, async (req, res) => {
  try {
    const { title, columns } = req.body;
    const userId = req.userId;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const currentUser = await usersModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBoard = await boardsModel.create({
      title: title.trim(),
      columns: columns || [],
      owner: userId,
      isGuest: currentUser.isGuest || false,
    });

    await usersModel.findByIdAndUpdate(userId, {
      $push: { boards: newBoard._id },
    });

    const populatedBoard = await boardsModel
      .findById(newBoard._id)
      .populate("owner", "fullName email profilePicture")
      .populate("collaborators", "fullName email profilePicture")
      .populate({
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      });

    res.json({
      message: "creating board was successful",
      data: populatedBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.put("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, columns } = req.body;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const currentBoard = await boardsModel.findOne({
      _id: id,
      owner: userId,
    });

    if (!currentBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    const existingColumnsMap = new Map(
      currentBoard.columns.map((col) => [col._id.toString(), col]),
    );

    const updatedColumns = (columns || []).map((col) => {
      const colId = col._id ? col._id.toString() : null;

      if (colId && existingColumnsMap.has(colId)) {
        const existingCol = existingColumnsMap.get(colId);
        return {
          _id: existingCol._id,
          title: col.title,
          tasks: existingCol.tasks || [],
        };
      }

      return {
        title: col.title,
        tasks: [],
      };
    });

    currentBoard.title = title.trim();
    currentBoard.columns = updatedColumns;
    await currentBoard.save();

    await currentBoard.populate([
      { path: "owner", select: "fullName email profilePicture" },
      { path: "collaborators", select: "fullName email profilePicture" },
      {
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      },
    ]);

    return res.json({
      message: "გილოცავ შენ წარმატებით განაახლე მონაცემი",
      data: currentBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.delete("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const deletedBoard = await boardsModel.findOneAndDelete({
      _id: id,
      owner: userId,
    });

    if (!deletedBoard) {
      return res
        .status(404)
        .json({ message: "Board not found or unauthorized" });
    }

    await invitationsModel.deleteMany({ board: id });
    await usersModel.updateMany({ boards: id }, { $pull: { boards: id } });

    res.json({ message: "Deleting board was successful", data: deletedBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.patch("/:id/drag", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { columns } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const updatedBoard = await boardsModel
      .findOneAndUpdate(
        {
          _id: id,
          $or: [{ owner: userId }, { collaborators: userId }],
        },
        { columns },
        { new: true },
      )
      .populate("owner", "fullName email profilePicture")
      .populate("collaborators", "fullName email profilePicture")
      .populate({
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      });

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.json({ message: "Board updated", data: updatedBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.post("/:id/collaborators", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const board = await boardsModel.findOne({ _id: id, owner: userId });
    if (!board) {
      return res.status(404).json({
        message: "Board not found or only owner can add collaborators",
      });
    }

    const invitedUser = await usersModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!invitedUser) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    if (invitedUser._id.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You are already the owner of this board" });
    }

    const isAlreadyCollaborator = board.collaborators.some(
      (collabId) => collabId.toString() === invitedUser._id.toString(),
    );

    if (isAlreadyCollaborator) {
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });
    }

    const existingInvitation = await invitationsModel.findOne({
      board: id,
      recipient: invitedUser._id,
      status: "pending",
    });

    if (existingInvitation) {
      return res
        .status(400)
        .json({ message: "Invitation has already been sent to this user" });
    }

    const newInvitation = await invitationsModel.create({
      board: id,
      sender: userId,
      recipient: invitedUser._id,
    });

    const populatedInvitation = await invitationsModel
      .findById(newInvitation._id)
      .populate("board", "title")
      .populate("sender", "fullName email profilePicture");

    return res.json({
      message: "Invitation sent successfully",
      data: populatedInvitation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.delete(
  "/:id/collaborators/:collaboratorId",
  isAuth,
  async (req, res) => {
    try {
      const { id, collaboratorId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(id) || !isValidObjectId(collaboratorId)) {
        return res.status(400).json({ message: "Invalid Board or User ID" });
      }

      const board = await boardsModel.findOne({ _id: id, owner: userId });

      if (!board) {
        return res.status(404).json({
          message: "Board not found or only owner can remove collaborators",
        });
      }

      const isCollaborator = board.collaborators.some(
        (collabId) => collabId.toString() === collaboratorId,
      );

      if (!isCollaborator) {
        return res
          .status(400)
          .json({ message: "User is not a collaborator on this board" });
      }

      const updatedBoard = await boardsModel
        .findByIdAndUpdate(
          id,
          {
            $pull: { collaborators: collaboratorId },
            $set: { "columns.$[col].tasks.$[task].assignee": null },
          },
          {
            arrayFilters: [
              { "col.tasks": { $exists: true } },
              { "task.assignee": collaboratorId },
            ],
            new: true,
          },
        )
        .populate("owner", "fullName email profilePicture")
        .populate("collaborators", "fullName email profilePicture")
        .populate({
          path: "columns.tasks.assignee",
          select: "fullName email profilePicture",
        });

      await usersModel.findByIdAndUpdate(collaboratorId, {
        $pull: { boards: id },
      });

      return res.json({
        message: "Collaborator removed successfully",
        data: updatedBoard,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = boardsRouter;
