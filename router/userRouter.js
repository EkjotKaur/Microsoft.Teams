// Requiring functions from controller
const { signup, login } = require("../controllers/userController");
const router = require("express").Router();

// SignUp
router.post("/signup", signup);

// Login
router.post("/login", login);

module.exports = router;
