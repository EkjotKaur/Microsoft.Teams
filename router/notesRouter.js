const { getNotes, createNote } = require("../controllers/notesController");

const router = require("express").Router();

// Middleware for checking with the user is logged in
const isLoggedIn = require("../middleware/isLoggedIn");

// Creating new note for team
router.post("/", isLoggedIn, createNote);

// Getting all the notes for the team
router.get("/:teamId", isLoggedIn, getNotes);

module.exports = router;
