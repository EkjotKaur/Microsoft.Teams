const { signup, login } = require("../controllers/userController");

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/signup", isLoggedIn, signup);
router.post("/login", isLoggedIn, login);

module.exports = router;
