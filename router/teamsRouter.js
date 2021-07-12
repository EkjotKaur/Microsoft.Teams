const {
  createTeams,
  joinTeam,
  getTeams,
  getTeamById,
  findContactFromTeams,
  searchContactFromTeams,
  leaveTeams,
} = require("../controllers/teamsController");

const router = require("express").Router();

// Middleware for checking with the user is logged in
const isLoggedIn = require("../middleware/isLoggedIn");

// Creating new team
router.post("/create", isLoggedIn, createTeams);

// Join an existing team with code
router.post("/join", isLoggedIn, joinTeam);

// Getting all the teams for the logged in user
router.get("/:userId", isLoggedIn, getTeams);

// Getting team by _id
router.get("/teamById/:teamId", isLoggedIn, getTeamById);

// Getting users that are part of the team which the logged in user is part of
router.get("/contacts/:userId", isLoggedIn, findContactFromTeams);

// Searhcing users with name that are part of the team which the logged in user is part of
router.post("/search/contacts/:userId", isLoggedIn, searchContactFromTeams);

router.patch("/leave", isLoggedIn, leaveTeams);

module.exports = router;
