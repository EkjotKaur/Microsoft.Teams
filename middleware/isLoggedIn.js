const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require('../config/keys');
const User = require("../model/userModel");

module.exports = (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    console.log("Error1");
    res.status(401).json({ error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log("Error2");
      return res.status(401).json({ error: "you must be logged in" });
    }

    console.log(payload);
    const { data } = payload;
    User.findById(data).then((userData) => {
      req.user = userData;
      console.log(req.user);
      next();
    });
  });
};
