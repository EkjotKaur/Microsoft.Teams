const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    teamsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    heading: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Notes = mongoose.model("notes", notesSchema);
