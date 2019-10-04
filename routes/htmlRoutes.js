var db = require("../models");
var isAuthenticated = require("../config/middleware/isAuthenticated.js");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // Load example page and pass in an example by id
  app.get("/productPage", isAuthenticated, function(req, res) {
    res.render("quote");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
