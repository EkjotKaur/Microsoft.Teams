const router = require("express").Router();
const {
  newConversation,
  getConversation,
} = require("../controllers/converstionController");

router.post("/", newConversation);
router.get("/:userId", getConversation);

module.exports = router;
