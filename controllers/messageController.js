const Message = require("../model/messageModel");
const Conversation = require("../model/conversationModel");
const User = require("../model/userModel");

exports.addMessage = async (req, res) => {
  let foundConversation;
  try {
    foundConversation = await Conversation.findById(req.body.conversationId);
    if (!foundConversation) res.json({ status: false, message: "Conversation not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  let foundUser;
  try {
    foundUser = await User.findById(req.body.senderId);
    if (!foundUser) return res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  console.log(foundUser);

  const newMessage = new Message({
    ...req.body,
    conversationId: foundConversation,
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
  Message.find({ conversationId: req.params.conversationId })
    .populate("sender", "-password")
    .then((messages) => {
      res.status(200).json({ status: true, data: messages });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Something went wrong" });
    });
};