const {
  addMessage,
  getMessage,
} = require("../controllers/messageTeamsController");

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");



router.post("/", isLoggedIn, addMessage);
router.get("/:teamId",isLoggedIn, getMessage);

module.exports = router;
