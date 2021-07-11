const Message = require("../model/messageModel");
const Conversation = require("../model/conversationModel");
const User = require("../model/userModel");

// Creating new Message for Personal chat between two users
exports.addMessage = async (req, res) => {
  const senderId = req.body.senderId ? req.body.senderId : req.user._id;

  // Finding the conversation in which the message is being send
  let foundConversation;
  try {
    foundConversation = await Conversation.findById(req.body.conversationId);
    if (!foundConversation)
      res.json({ status: false, message: "Conversation not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Find the sender from the DB
  let foundUser;
  try {
    foundUser = await User.findById(senderId);
    if (!foundUser)
      return res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Creating new message
  const newMessage = new Message({
    ...req.body,
    conversationId: foundConversation,
    sender: foundUser,
  });

  // Updating the last message sent time for the Conversation
  foundConversation.lastMessage = new Date();
  let savedMessage, updatedConvo;

  // Saving the new message and updating the conversation
  try {
    savedMessage = await newMessage.save();
    updatedConvo = await foundConversation.save();
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
  res.status(200).json({ status: true, data: savedMessage });
};

// Getting all the messages for a particular conversation
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
