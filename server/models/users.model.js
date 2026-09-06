const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isGuest: { type: Boolean, default: false },
    profilePicture: {
      type: String,
      default: function () {
        const formattedName = this.fullName
          ? this.fullName.trim().replace(/\s+/g, "+")
          : "User";
        return `https://ui-avatars.com/api/?name=${formattedName}&background=635FC7&color=FFFFFF`;
      },
    },
    boards: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "boards",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { isGuest: true },
  },
);

module.exports = mongoose.model("user", userSchema);
