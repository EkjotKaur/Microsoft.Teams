const { signup, login } = require("../controllers/userController");

const router = require("express").Router();
// const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
