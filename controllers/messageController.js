const Message = require("../model/messageModel");
const Conversation = require("../model/conversationModel");
const User = require("../model/userModel");

exports.addMessage = async (req, res) => {
  const senderId = req.body.senderId ? req.body.senderId : req.user._id;
  let foundConversation;
  try {
    foundConversation = await Conversation.findById(req.body.conversationId);
    if (!foundConversation)
      res.json({ status: false, message: "Conversation not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  let foundUser;
  try {
    foundUser = await User.findById(senderId);
    if (!foundUser)
      return res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  console.log(foundUser);

  const newMessage = new Message({
    ...req.body,
    conversationId: foundConversation,
    sender: foundUser,
  });

  foundConversation.lastMessage = new Date();
  let savedMessage, updatedConvo;
  try {
    savedMessage = await newMessage.save();
    updatedConvo = await foundConversation.save();
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
  res.status(200).json({ status: true, data: savedMessage });
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
