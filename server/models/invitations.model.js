const { default: mongoose } = require("mongoose");

const invitationsSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boards",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

invitationsSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: {
      status: { $in: ["accepted", "rejected"] },
    },
  },
);

module.exports = mongoose.model("invitation", invitationsSchema);
