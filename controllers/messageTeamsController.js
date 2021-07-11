const Message = require("../model/teamsMessagesModel");
const Team = require("../model/teamsModel");
const User = require("../model/userModel");

// Creating new Message for Teams chat between multiple users
exports.addMessage = async (req, res) => {
  const senderId = req.body.senderId ? req.body.senderId : req.user._id;
  let foundTeam;
  try {
    foundTeam = await Team.findById(req.body.teamId);
    if (!foundTeam) res.json({ status: false, message: "Team not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Searching sender from DB
  let foundUser;
  try {
    foundUser = await User.findById(senderId);
    if (!foundUser)
      return res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Creating new Message
  const newMessage = new Message({
    ...req.body,
    teamsId: foundTeam,
    sender: foundUser,
  });

  // Saving new message
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

// Getting all the messages for a particular team
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
