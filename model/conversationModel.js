const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

module.exports = Converation = mongoose.model(
  "conversation",
  conversationSchema
);
