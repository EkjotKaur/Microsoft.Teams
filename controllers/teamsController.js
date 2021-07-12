const Team = require("../model/teamsModel");
const User = require("../model/userModel");
const { v4 } = require("uuid");

// Creating a new Team
exports.createTeams = async (req, res) => {
  const creatorId = req.body.creatorId ? req.body.creatorId : req.user._id;

  // Searching the creator of the team
  let foundSender;
  try {
    foundSender = await User.findById(creatorId);
    if (!foundSender) res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Creating new teams
  const newTeam = new Team({
    members: [foundSender],
    code: v4(), // unique random code for team
    admin: foundSender,
    name: req.body.name,
    description: req.body.description,
  });

  // Saving the team in the DB
  try {
    const savedTeam = await newTeam.save();
    res.status(200).json({ status: true, data: savedTeam });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", status: false });
  }
};

// Joining an existing team with its code
exports.joinTeam = async (req, res) => {
  const memberId = req.body.memberId ? req.body.memberId : req.user._id;

  // Searching the member in the DB
  let foundMember;
  try {
    foundMember = await User.findById(memberId);
    if (!foundMember) res.json({ status: false, message: "User not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  //  Searching the Team from the DB
  let foundTeam;
  try {
    foundTeam = await Team.findOne({ code: req.body.code });
    if (!foundTeam) res.json({ status: false, message: "Team not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Checking if the member already includes in the teams
  if (foundTeam.members.includes(foundMember._id)) {
    return res.json({ status: false, message: "Already in this team" });
  }

  // Updating the teams by adding a new Member to it
  let updatedTeam;
  try {
    updatedTeam = await Team.findOneAndUpdate(
      { code: req.body.code },
      {
        $push: { members: foundMember },
      }
    );
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  res.status(200).json({ status: true, data: updatedTeam });
};

exports.getTeams = (req, res) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;

  // Finding a team with userId
  Team.find({ members: { $in: userId } })
    .populate([{ path: "members" }])
    .populate("admin")
    .sort("createdAt")
    .then((team) => {
      res.status(200).json({ status: true, data: team });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};

exports.getTeamById = (req, res) => {
  // Finding a team with _id
  Team.findById(req.params.teamId)
    .populate([{ path: "members" }])
    .populate("admin")
    .then((team) => {
      res.status(200).json({ status: true, data: team });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};

// Find all the users that are parts of any of the teams the user(the logged in user) is member of
exports.findContactFromTeams = async (req, res) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;

  // Finding all the teams the user it member of
  let foundTeams = [];
  try {
    foundTeams = await Team.find({ members: { $in: userId } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", status: false });
  }

  let users = [];

  // Finding the _id of all the members in the found Teams
  // And Pushing it in the users array
  foundTeams.forEach((team) => {
    team.members.forEach((member) => {
      if (member != req.body.userId && !users.includes(member))
        users.push(member);
    });
  });

  // Finding the users whose _id is in users array
  let foundUsers;
  try {
    foundUsers = await User.find({ _id: { $in: users } }).sort("name");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", status: false });
  }

  // filtering the users by excluding the present user(the logged in user)
  foundUsers = foundUsers.filter((user) => user._id != req.params.userId);

  res.status(200).json({ status: true, data: foundUsers });
};

// Search users by "name" that are parts of any of the teams the user(the logged in user) is member of
exports.searchContactFromTeams = async (req, res) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;

  // Finding all the teams the user it member of
  let foundTeams = [];
  try {
    foundTeams = await Team.find({ members: { $in: userId } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", status: false });
  }

  let users = [];

  // Finding the _id of all the members in the found Teams
  // And Pushing it in the users array
  foundTeams.forEach((team) => {
    team.members.forEach((member) => {
      if (member != req.body.userId && !users.includes(member))
        users.push(member);
    });
  });

  // Finding the users whose _id is in users array
  let foundUsers;
  try {
    foundUsers = await User.find({
      _id: { $in: users },
      name: { $regex: req.body.name, $options: "i" },
    }).sort("name");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", status: false });
  }

  // filtering the users by excluding the present user(the logged in user)
  foundUsers = foundUsers.filter((user) => user._id != req.params.userId);

  res.status(200).json({ status: true, data: foundUsers });
};

exports.leaveTeams = (req, res) => {
  const { teamId } = req.body;
  Team.findByIdAndUpdate(teamId, { $pull: { members: req.user._id } })
    .then((updatedTeams) => {
      res.status(200).json({ status: true, data: updatedTeams });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};
