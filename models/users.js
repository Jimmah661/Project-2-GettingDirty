// This will be the model for the user database
// We'll be using bcrypt to convert passwords to hashed values so that we're
// not storing any plain text passwords in the database

// Require the bcrypt module
var bcrypt = require("bcryptjs");

// We'll now create the model to export
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Username field
    email: {
      type: DataTypes.STRING,
      // Cannot be null
      allowNull: false,
      // Must be unique
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Password field
    password: {
      type: DataTypes.STRING,
      // Cannot be null
      allowNull: false
    },
    // Admin field (If this user is a site admin or not)
    admin: {
      // Its a true or false value
      type: DataTypes.BOOLEAN,
      // It cannot be empty
      // allowNull: false,
      // By default this value will be empty
      dafaultValue: false
    }
  });
  // END DEFINITION OF MODEL

  // This is a custome function attached to the User model that allows us
  // to compare the entered password to our hashed password stored in the database.
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  // this will run before pushing information into the database,
  // it will hash the password value for storing
  User.beforeCreate(function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  User.associate = function(models) {
    User.hasMany(models.Quotes, {});
  };

  // End the model and export for use elsewhere
  return User;
};
