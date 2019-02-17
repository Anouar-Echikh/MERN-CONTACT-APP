const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.controller");
const contactController = require("../controllers/contact.controller");

//auth and sign up

router.post("/register", userController.register);
router.post("/auth", userController.login);

/**
 * just a get method for testing auth using passport-jwt
 *
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.send({
      message: "You are authorized!"
    });
  }
);*/

// Customize auth message Protect the  routes
router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("You are not authorized to access this area");
      error.status = 401;
      throw error;
    }

    //
    req.user = user;
    return next();
  })(req, res, next);
});

router.get("/test", userController.me);
router.get("/contact", contactController.get);
router.post("/contact", contactController.create);
router.put("/contact/:contact_id", contactController.update);
router.delete("/contact/:contact_id", contactController.destroy);

module.exports = router;
