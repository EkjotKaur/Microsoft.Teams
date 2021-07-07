const {
  createTeams,
  joinTeam,
  getTeams,
  getTeamById
} = require("../controllers/teamsController");

const router = require("express").Router();

router.post("/create", createTeams);
router.post("/join", joinTeam);
router.get("/:userId", getTeams);
router.get("/teamById/:teamId", getTeamById);

module.exports = router;
