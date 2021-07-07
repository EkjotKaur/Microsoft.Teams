const Message = require("../model/teamsMessagesModel");
const Team = require("../model/teamsModel");
const User = require("../model/userModel");

exports.addMessage = async (req, res) => {
  let foundTeam;
  try {
    foundTeam = await Team.findById(req.body.teamId);
    if (!foundTeam) res.json({ status: false, message: "Team not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  let foundUser;
  try {
    foundUser = await User.findById(req.body.senderId);
    if (!foundUser)
      return res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // console.log(foundUser);

  const newMessage = new Message({
    ...req.body,
    teamsId: foundTeam,
    sender: foundUser,
  });

  newMessage
    .save()
    .then((savedMessage) => {
      res.status(200).json({ status: true, data: savedMessage });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};

exports.getMessage = (req, res) => {
  // console.log(req.params.teamId);
  Message.find({ teamsId: req.params.teamId })
    .populate("sender", "-password")
    .then((messages) => {
      // console.log(messages);
      res.status(200).json({ status: true, data: messages });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};
