const Conversation = require("../model/conversationModel");
const User = require("../model/userModel");

//  Creating new conversation
exports.newConversation = async (req, res) => {
  const senderId = req.body.senderId ? req.body.senderId : req.user._id;

  // Searching sender from DB
  let foundSender;
  try {
    foundSender = await User.findById(senderId);
    if (!foundSender) res.json({ status: false, message: "Sender not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Searching reciever from DB
  let foundReciever;
  try {
    foundReciever = await User.findById(req.body.recieverId);
    if (!foundReciever)
      res.json({ status: false, message: "Reciever not found" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }

  // Creating new Conversation
  const newConversation = new Conversation({
    members: [foundSender, foundReciever],
  });

  // Saving the conversation in the DB
  try {
    const savedConservation = await newConversation.save();
    res.status(200).json({ status: true, data: savedConservation });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", status: false });
  }
};

// Getting conversations for a user
exports.getConversation = (req, res) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;

  // Finding conversations for a user and populating all its members i.e the two users btw conversation is occuring
  Conversation.find({ members: { $in: userId } })
    .populate([{ path: "members" }])
    .sort("-lastMessage")
    .then((conversations) => {
      res.status(200).json({ status: true, data: conversations });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong", status: false });
    });
};

// Searching conversation two particular users 
exports.searchConversation = (req, res) => {
  const user1 = req.body.user1 ? req.body.user1 : req.user._id;
  Conversation.findOne({ members: { $all: [user1, req.body.user2] } })
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
