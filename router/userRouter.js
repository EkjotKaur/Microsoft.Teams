const { signup, login } = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
