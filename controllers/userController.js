const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNING UP USER
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // checking for required fields
  if (!email || !password) {
    res
      .status(422)
      .json({ message: "Please fill all the details", status: false });
  }

  // checking if the user exists
  let user;
  try {
    user = await User.findOne({
      email: email,
    });
    if (user) {
      console.log("Exists");
      res.status(422).json({
        success: "false",
        message: "E-mail already exists",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "Something went wrong",
    });
  }

  const newUser = new User({
    ...req.body,
  });

  // hashing and salting the password
  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: "false",
          message: "Something went wrong",
        });
      }
      // generating a jwt token
      const token = jwt.sign(
        {
          data: newUser._id,
        },
        process.env.JWT_SECRET,
        {}
      );

      // adding to the created new user
      newUser.token = token;
      newUser.password = hash;

      // saving the user
      newUser
        .save()
        .then((user) => {
          return res.status(200).json({
            success: "true",
            data: user,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            success: "false",
            message: "something went wrong 4",
          });
        });
    });
  });
};

// LOGINING USER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Searching for user with the email
  let foundUser;
  try {
    foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(422).json({
        success: "false",
        message: "Incorrect email or password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "Something went wrong",
    });
  }

  // Comparing the password from the client side and hashed password from the database
  bcrypt
    .compare(password, foundUser.password)
    .then((doesMatched) => {
      if (!doesMatched) {
        return res.status(422).json({
          success: "false",
          message: "Incorrect email or password",
        });
      }
      console.log(foundUser);

      res.status(200).json({
        success: "true",
        data: foundUser,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: "false",
        message: "Something went wrong",
      });
    });
};
