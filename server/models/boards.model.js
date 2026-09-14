const { default: mongoose } = require("mongoose");

const subtasksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const tasksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  subTasks: {
    type: [subtasksSchema],
    default: [],
  },
});

const columnsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  tasks: {
    type: [tasksSchema],
    default: [],
  },
});

const boardsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    columns: {
      type: [columnsSchema],
      default: [],
    },
    isGuest: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

boardsSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { isGuest: true },
  },
);

module.exports = mongoose.model("boards", boardsSchema);
