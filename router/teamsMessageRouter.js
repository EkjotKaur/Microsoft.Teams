const {
  addMessage,
  getMessage,
} = require("../controllers/messageTeamsController");

const router = require("express").Router();

router.post("/", addMessage);
router.get("/:teamId", getMessage);

module.exports = router;
