const Conversation = require("../model/conversationModel");
const User = require("../model/userModel");

exports.newConversation = async (req, res) => {
  let foundSender;
  try {
    foundSender = await User.findById(req.body.senderId);
    if (!foundSender) res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  let foundReciever;
  try {
    foundReciever = await User.findById(req.body.recieverId);
    if (!foundReciever)
      res.json({ status: false, message: "Reciever not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
  const newConversation = new Conversation({
    members: [foundSender, foundReciever],
  });

  try {
    const savedConservation = await newConversation.save();
    res.status(200).json({ status: true, data: savedConservation });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", status: false });
  }
};

exports.getConversation = (req, res) => {
  Conversation.find({ members: { $in: req.params.userId } })
    .populate([{ path: "members" }])
    .sort("-lastMessage")
    .then((conversations) => {
      res.status(200).json({ status: true, data: conversations });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};

exports.searchConversation = (req, res) => {
  Conversation.findOne({ members: { $all: [req.body.user1, req.body.user2] } })
    .populate([{ path: "members" }])
    .then((conversation) => {
      if (conversation)
        res.status(200).json({ status: true, data: conversation });
      else
        res
          .status(200)
          .json({ status: false, message: "Conversation not found" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};
