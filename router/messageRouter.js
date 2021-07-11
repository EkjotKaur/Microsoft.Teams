const { addMessage, getMessage } = require("../controllers/messageController");

const router = require("express").Router();

// Middleware for checking with the user is logged in
const isLoggedIn = require("../middleware/isLoggedIn");

//  Creating new message for one-to-one converstion
router.post("/", isLoggedIn, addMessage);

// Getting all the messages for the conversation 
router.get("/:conversationId", isLoggedIn, getMessage);

module.exports = router;
