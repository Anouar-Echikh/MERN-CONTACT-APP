const JwtStrategy = require("passport-jwt").Strategy;
const ExtratJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/users.model");

module.exports = passport => {
  let config = {};
  config.secretOrKey = process.env.JWT_SECRET;
  config.jwtFromRequest = ExtratJwt.fromAuthHeaderAsBearerToken();

  passport.use(
    new JwtStrategy(config, async (jwtPayload, done) => {
      try {
        const foundUser = await User.findById(jwtPayload._id);
        if (foundUser) {
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(err, false);
      }
    })
  );
};
