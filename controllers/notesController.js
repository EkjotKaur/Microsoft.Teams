const Notes = require("../model/notesModel");
const Teams = require("../model/teamsModel");

exports.createNote = async (req, res) => {
  const { heading, title, teamId } = req.body;

  let foundTeam;
  try {
    foundTeam = await Teams.findById(teamId);
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
  if (!foundTeam) {
    res.status(404).json({ status: false, message: "Teams not found" });
  }

  const note = new Notes({
    ...req.body,
    teamsId: foundTeam,
    creator: req.user,
  });

  note
    .save()
    .then((savedNotes) => {
      res.status(200).json({ status: true, data: savedNotes });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};

exports.getNotes = (req, res) => {
  Notes.find({ teamsId: req.params.teamId })
    .populate("creator", "name")
    .sort("-createdAt")
    .then((notes) => {
      console.log(notes);
      res.status(200).json({ status: true, data: notes });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};
