const { addMessage, getMessage } = require("../controllers/messageController");

const router = require("express").Router();

router.post("/", addMessage);
router.get("/:conversationId", getMessage);

module.exports = router;
