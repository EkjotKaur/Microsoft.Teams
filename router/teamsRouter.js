const {
  createTeams,
  joinTeam,
  getTeams,
  getTeamById,
  findContactFromTeams,
  searchContactFromTeams,
} = require("../controllers/teamsController");

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/create", isLoggedIn, createTeams);
router.post("/join", isLoggedIn, joinTeam);
router.get("/:userId", isLoggedIn, getTeams);
router.get("/teamById/:teamId", isLoggedIn, getTeamById);
router.get("/contacts/:userId", isLoggedIn, findContactFromTeams);
router.post("/search/contacts/:userId", isLoggedIn, searchContactFromTeams);

module.exports = router;
