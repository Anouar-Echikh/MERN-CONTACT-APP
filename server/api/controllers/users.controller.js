const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const userController = {};

/***
 * Sign up logic
 */

userController.register = async (req, res, next) => {
  const { name, email, password, joined } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    joined
  });

  try {
    const userAdded = await newUser.save();
    return res.send({ user: userAdded });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoError") {
      const error = new Error(
        `Email address ${newUser.email} is already taken`
      );
      error.status = 400;
      next(error);
    } else {
      next(e);
    }
    // if the error 11000 isn't hundled by mongo we should drop the table ==> db.users.drop() and restart our node server.
    //To hundle such errors we can install and use mongoose-unique-validator.js in users.model.js ==> https://www.npmjs.com/package/mongoose-unique-validator
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //check email and password
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      const err = new `The email :${email} is not found in system`();
      err.status = 401;
      next(err);
    }
    foundUser.isPasswordMatch(password, foundUser.password, (err, match) => {
      if (match) {
        /*res.send({
          message: "you can login"
        });*/
        //if credit ok ,then return jwt
        const secret = process.env.JWT_SECRET;
        const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
        const token = jwt.sign({ _id: foundUser._id }, secret, {
          expiresIn: expiration
        });
        res.send({
          message: { Jwt: token }
        });
      }
      res.send({
        error: "invalid yousername/password combination!"
      });
    });
  } catch (e) {
    next(e);
  }
};

userController.me = (req, res, next) => {
  const { user } = req;
  res.send({ user });
};
module.exports = userController;
