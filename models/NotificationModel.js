const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    creator: {
      type: Object,
    },
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    postId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
