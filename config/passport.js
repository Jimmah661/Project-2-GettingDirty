// Require the modules to be used in the config
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// Require the database models
var db = require("../models");

// Set up the strategy to login using local credentials.
// This is documented at http://www.passportjs.org/packages/passport-local/
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      // When someone tries to login to the system this code will run
      db.User.findOne({
        where: {
          email: email
        }
      }).then(function(dbUser) {
        // if there is no registered user with that userID then it will run this script
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email"
          });
        }
        // If the userID is correct but the password is wrong then run this
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect Password."
          });
        }
        // If the userID and password are correct then return done
        return done(null, dbUser);
      });
    }
  )
);

// This is boilerplate for Passport and required for the Authentication Session
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
//
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
