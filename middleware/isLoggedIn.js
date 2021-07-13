const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// Middleware to check if the user is logged in or not
module.exports = (req, res, next) => {
  // Checking the authorization from the request made by the client
  const { authorization } = req.headers;
  if (!authorization) {
    // If the header is not present user is not logged in
    res.status(401).json({ error: "You must be logged in" });
  }

  // Verifying the tokenn from the clietn side (in the header) to the actual token using the JWT_SECRET
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      // if the token doesn't verify
      return res.status(401).json({ error: "you must be logged in" });
    }

    // Saving the verified user in req.user and moving ahead
    const { data } = payload;
    User.findById(data).then((userData) => {
      req.user = userData;
      console.log(req.user);
      next();
    });
  });
};
