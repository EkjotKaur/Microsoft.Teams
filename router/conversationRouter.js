const router = require("express").Router();
const {
  newConversation,
  getConversation,
  searchConversation,
} = require("../controllers/converstionController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/", isLoggedIn, newConversation);
router.get("/:userId", isLoggedIn, getConversation);
router.post("/search", isLoggedIn, searchConversation);

module.exports = router;
