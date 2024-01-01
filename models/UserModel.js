const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your Name"],
    },
    userName: {
      type: String,
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    avatar: {
      type: String,
    },
    followers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          unique: true,
          require: false,
        },
      },
    ],
    following: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          unique: true,
          require: false,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ "followers.userId": 1 }, { unique: true, sparse: true });
userSchema.index({ "following.userId": 1 }, { unique: true, sparse: true });
// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
