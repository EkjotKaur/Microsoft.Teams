const {
  addMessage,
  getMessage,
} = require("../controllers/messageTeamsController");

const router = require("express").Router();

// Middleware for checking with the user is logged in
const isLoggedIn = require("../middleware/isLoggedIn");

// Creating new message for team
router.post("/", isLoggedIn, addMessage);

// Getting all messages for the team
router.get("/:teamId", isLoggedIn, getMessage);

module.exports = router;
