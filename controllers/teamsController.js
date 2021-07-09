const Team = require("../model/teamsModel");
const User = require("../model/userModel");
const { v4 } = require("uuid");

exports.createTeams = async (req, res) => {
  let foundSender;
  try {
    foundSender = await User.findById(req.body.creatorId);
    if (!foundSender) res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  const newTeam = new Team({
    members: [foundSender],
    code: v4(),
    admin: foundSender,
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const savedTeam = await newTeam.save();
    res.status(200).json({ status: true, data: savedTeam });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", status: false });
  }
};

exports.joinTeam = async (req, res) => {
  // console.log(req.body);
  let foundMember;
  try {
    foundMember = await User.findById(req.body.memberId);
    if (!foundMember) res.json({ status: false, message: "User not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // console.log(foundMember);

  let foundTeam;
  try {
    foundTeam = await Team.findOne({ code: req.body.code });
    if (!foundTeam) res.json({ status: false, message: "Team not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // console.log(foundTeam);
  // console.log(foundMember._id);
  // console.log(foundMember);
  // console.log(foundTeam.members.includes(foundMember._id));
  // console.log(foundTeam.members.includes(foundMember));

  if (foundTeam.members.includes(foundMember._id)) {
    return res.json({ status: false, message: "Already in this team" });
  }

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
  Team.find({ members: { $in: req.params.userId } })
    .populate([{ path: "members" }])
    .populate("admin")
    .then((team) => {
      res.status(200).json({ status: true, data: team });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};

exports.getTeamById = (req, res) => {
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

exports.findContactFromTeams = async (req, res) => {
  let foundTeams = [];
  try {
    foundTeams = await Team.find({ members: { $in: req.params.userId } });
  } catch (err) {
    console.log(err);
    res.json(err);
  }

  console.log(foundTeams);
  let users = [];
  // if (foundTeams) {
  foundTeams.forEach((team) => {
    team.members.forEach((member) => {
      if (member != req.body.userId && !users.includes(member))
        users.push(member);
    });
  });
  // }

  let foundUsers;
  try {
    foundUsers = await User.find({ _id: { $in: users } });
  } catch (err) {
    console.log(err);
    res.json(err);
  }

  foundUsers = foundUsers.filter((user) => user._id != req.params.userId);
  console.log(foundUsers);

  res.status(200).json({ status: true, data: foundUsers });
};

exports.searchContactFromTeams = async (req, res) => {
  let foundTeams = [];
  try {
    foundTeams = await Team.find({ members: { $in: req.params.userId } });
  } catch (err) {
    console.log(err);
    res.json(err);
  }

  console.log(foundTeams);
  let users = [];
  // if (foundTeams) {
  foundTeams.forEach((team) => {
    team.members.forEach((member) => {
      if (member != req.body.userId && !users.includes(member))
        users.push(member);
    });
  });
  // }

  let foundUsers;
  try {
    foundUsers = await User.find({
      _id: { $in: users },
      name: { $regex: req.body.name, $options: "i" },
    }).sort("name");
  } catch (err) {
    console.log(err);
    res.json(err);
  }

  console.log(foundUsers);
  foundUsers = foundUsers.filter((user) => user._id != req.params.userId);

  res.status(200).json({ status: true, data: foundUsers });
};
