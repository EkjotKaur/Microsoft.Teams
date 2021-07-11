const router = require("express").Router();
const {
  newConversation,
  getConversation,
  searchConversation,
} = require("../controllers/converstionController");

// Middleware for checking with the user is logged in
const isLoggedIn = require("../middleware/isLoggedIn");

// Creating new Conversation for two users (personal chat/room)
router.post("/", isLoggedIn, newConversation);

// getting all the converstions for the user
router.get("/:userId", isLoggedIn, getConversation);

// searching conversation between two users
router.post("/search", isLoggedIn, searchConversation);

module.exports = router;
