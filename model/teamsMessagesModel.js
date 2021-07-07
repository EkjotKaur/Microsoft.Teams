const mongoose = require("mongoose");

const messageTeamSchema = new mongoose.Schema(
  {
    teamsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = MessageTeam = mongoose.model("messageTeam", messageTeamSchema);
