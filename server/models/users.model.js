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
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpiresAt: {
      type: Date,
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
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

userSchema.index(
  { verificationCodeExpiresAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { isVerified: false },
  },
);

module.exports = mongoose.model("user", userSchema);
