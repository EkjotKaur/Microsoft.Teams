const { getNotes, createNote } = require("../controllers/notesController");

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/", isLoggedIn, createNote);
router.get("/:teamId", isLoggedIn, getNotes);

module.exports = router;
