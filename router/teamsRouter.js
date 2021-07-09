const {
  createTeams,
  joinTeam,
  getTeams,
  getTeamById,
  findContactFromTeams,
  searchContactFromTeams
} = require("../controllers/teamsController");

const router = require("express").Router();

router.post("/create", createTeams);
router.post("/join", joinTeam);
router.get("/:userId", getTeams);
router.get("/teamById/:teamId", getTeamById);
router.get("/contacts/:userId", findContactFromTeams);
router.post("/search/contacts/:userId", searchContactFromTeams);

module.exports = router;
