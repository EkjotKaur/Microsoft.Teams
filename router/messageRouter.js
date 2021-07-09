const { addMessage, getMessage } = require("../controllers/messageController");

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/", isLoggedIn, addMessage);
router.get("/:conversationId", isLoggedIn, getMessage);

module.exports = router;
