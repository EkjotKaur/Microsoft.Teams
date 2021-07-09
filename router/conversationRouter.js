const router = require("express").Router();
const {
  newConversation,
  getConversation,
  searchConversation,
} = require("../controllers/converstionController");

router.post("/", newConversation);
router.get("/:userId", getConversation);
router.post("/search", searchConversation);

module.exports = router;
