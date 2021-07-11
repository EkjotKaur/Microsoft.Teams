const Notes = require("../model/notesModel");
const Teams = require("../model/teamsModel");

// Creating a new note for a team
exports.createNote = async (req, res) => {
  const { heading, title, teamId } = req.body;

  // Searching the team in the DB
  let foundTeam;
  try {
    foundTeam = await Teams.findById(teamId);
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
  if (!foundTeam) {
    res.status(404).json({ status: false, message: "Teams not found" });
  }

  // Creating new Note
  const note = new Notes({
    ...req.body,
    teamsId: foundTeam,
    creator: req.user,
  });

  // Saving new Note
  note
    .save()
    .then((savedNotes) => {
      res.status(200).json({ status: true, data: savedNotes });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};

// Getting all the notes for a team
exports.getNotes = (req, res) => {
  // Sorting the notes in decreasing order of creation
  Notes.find({ teamsId: req.params.teamId })
    .populate("creator", "name")
    .sort("-createdAt")
    .then((notes) => {
      res.status(200).json({ status: true, data: notes });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};
