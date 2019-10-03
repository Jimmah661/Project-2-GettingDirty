var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // -------------------------- BELOW THIS LINE IS JAMES'S LOGIN ROUTES --------------------------
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    console.log("Testing");
    res.json("/quotes");
  });
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  });
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
  //----------- get all products from the soiled_db/products table -------

  app.get("/api/products", function(req, res) {
    db.Products.findAll({}).then(function(dbProducts) {
      res.json(dbProducts);
    });
  });

  //------------get a product from the soiled_db/products table ----

  app.get("/api/products/:id", function(req, res) {
    db.Products.findOne({ where: { id: req.params.id } }).then(function(
      dbProducts
    ) {
      res.json(dbProducts);
    });
  });

  //-----------get a completed quote from the soiled_db/quotes table
  app.get("/api/quotes/:id", function(req, res) {
    db.Quotes.findOne({ where: { id: req.params.id } }).then(function(
      dbQuotes
    ) {
      res.json(dbQuotes);
    });
  });

  // -------  create a quote for a product ---------------------------

  app.post("/api/quotes", function(req, res) {
    db.Quotes.create(req.body).then(function(dbQuotes) {
      res.json(dbQuotes);
    });
  });

  // -------------------------- BELOW THIS LINE ARE EXAMPLES --------------------------
  // // Get all examples
  // app.get("/api/examples", function(req, res) {
  //   db.Example.findAll({}).then(function(dbExamples) {
  //     res.json(dbExamples);
  //   });
  // });

  // // Create a new example
  // app.post("/api/examples", function(req, res) {
  //   db.Example.create(req.body).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
