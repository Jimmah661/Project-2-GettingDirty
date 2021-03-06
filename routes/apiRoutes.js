var db = require("../models");
var passport = require("../config/passport");
var PDFDocument = require("pdfkit");
var moment = require("moment");
var fs = require("fs");
module.exports = function (app) {
  // -------------------------- BELOW THIS LINE IS JAMES'S LOGIN ROUTES --------------------------
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    console.log("Testing");
    res.json("/productPage");
  });
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
      });
  });
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
  //----------- get all products from the soiled_db/products table -------

  app.get("/api/products", function (req, res) {
    db.Products.findAll({}).then(function (dbProducts) {
      res.json(dbProducts);
    });
  });

  //------------get a product from the soiled_db/products table ----

  app.get("/api/products/:id", function (req, res) {
    db.Products.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (
      dbProducts
    ) {
      res.json(dbProducts);
    });
  });

  //-----------get a completed quote from the soiled_db/quotes table
  app.get("/api/quotes/:id", function (req, res) {
    db.Quotes.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (
      dbQuotes
    ) {
      res.json(dbQuotes);
    });
  });

  // -------  create a quote for a product ---------------------------

  app.post("/api/quotes", function (req, res) {
    console.log(req.body);
    db.Quote.create({
      quantity: req.body.quantity,
      ProductId: req.body.ProductId,
      UserId: req.body.UserId
    }).then(function (dbQuotes) {
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

  app.post("/pdf", function (req, res) {
    console.log(req.body);


    db.Quotes.bulkCreate([{
        quoteID: "Q112",
        quantity: req.body.qtyNumber1,
        ProductId: req.body.prodNumber1,
        UserId: "1"
      },
      {
        quoteID: "Q112",
        quantity: req.body.qtyNumber2,
        ProductId: req.body.prodNumber2,
        UserId: "1"
      },
      {
        quoteID: "Q112",
        quantity: req.body.qtyNumber3,
        ProductId: req.body.prodNumber3,
        UserId: "1"
      }
    ]).then(() => {
      return db.Quotes.findAll({
        where: {
          quoteID: "Q112"
        },
        include: [db.User, db.Products],
      });
    }).then(fetch => {
      console.log(fetch)
      var date = moment().format("DD/MM/YYYY");
      // console.log("NAME IS",fetch[0].User)
      var id= fetch[0].quoteID
      var name = fetch[0].User.name;
      var email = fetch[0].User.email;
      //******START OF PDF GENERATION *******//
      var doc = new PDFDocument({
        margin: 50
      });
      //doc.pipe(fs.createWriteStream("output.pdf"));
      var filename = encodeURIComponent(id) + '.pdf';
      res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
      res.setHeader('Content-type', 'application/pdf');
      generateHeader(doc);
      generateCustomerInformation(doc, id, name, date, email);
      generateInvoiceTable(doc, fetch)
      generateFooter(doc);
      doc.pipe(res);
      doc.end();

      //******END OF PDF GENERATION *******//

      function generateHeader(doc) {
        doc
          .image("./public/assets/img/HOME-Bayside-Logo-NEW.png", 50, 45, {
            width: 50
          })
          .fillColor("#444444")
          .fontSize(20)
          .text("Soiled INC.", 110, 57)
          .fontSize(10)
          .text("123 Main Street", 200, 65, {
            align: "right"
          })
          .text("Caufield, VIC, 3163", 200, 80, {
            align: "right"
          })
          .moveDown();
      }

      function generateFooter(doc) {
        doc
          .fontSize(10)
          .text(
            "This quote is valid for 30 days. Thank you for your business.",
            50,
            730, {
              align: "center",
              width: 500
            }
          );
      }

      function generateCustomerInformation(doc, id, name, date) {
        doc
          .fillColor("#444444")
          .fontSize(20)
          .text("QUOTE", 50, 160);

        generateHr(doc, 185);

        var customerInformationTop = 200;

        doc
          .fontSize(10)
          .text("Quote Number:", 50, customerInformationTop)
          .font("Helvetica-Bold")
          .text(id, 150, customerInformationTop)
          .font("Helvetica")
          .text("Quote Date:", 50, customerInformationTop + 15)
          .text(date, 150, customerInformationTop + 15)
          .font("Helvetica")
          .text("Name:", 300, customerInformationTop)
          .text(name, 350, customerInformationTop)
          .text("Email:", 300, customerInformationTop + 15)
          .text(email, 350, customerInformationTop + 15)
          .moveDown();

        generateHr(doc, 252);
      }
      function generateInvoiceTable(doc, fetch) {
        var i;
        var invoiceTableTop = 330;
        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          invoiceTableTop,
          "Item",
          "Description",
          "Unit Cost",
          "Quantity",
          "Total Cost"
        );
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");
        var Total = 0;
        for (i = 0; i < fetch.length; i++) {
          var itemTotal = fetch[i].quantity * fetch[i].Product.price;
          Total += itemTotal;
          var position = invoiceTableTop + (i + 1) * 30;
          generateTableRow(
            doc,
            position,
            fetch[i].Product.id,
            fetch[i].Product.name,
            formatCurrency(fetch[i].Product.price),
            fetch[i].quantity,
            formatCurrency(itemTotal)
          );

          generateHr(doc, position + 20);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          subtotalPosition,
          "",
          "",
          "Subtotal",
          "",
          formatCurrency(Total)
        );
      }

      function generateTableRow(
        doc,
        y,
        item,
        description,
        unitCost,
        quantity,
        lineTotal
      ) {
        doc
          .fontSize(10)
          .text(item, 50, y)
          .text(description, 150, y)
          .text(unitCost, 280, y, {
            width: 90,
            align: "right"
          })
          .text(quantity, 370, y, {
            width: 90,
            align: "right"
          })
          .text(lineTotal, 0, y, {
            align: "right"
          });
      }

      function formatCurrency(currency) {
        return "$" + currency;
      }
      function generateHr(doc, y) {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      }
    });
  
    
  });
  //################CODE FOR PDF GENERATION###################
  // app.get("/pdf/:id", function (req, res) {
  //   var id = req.params.id;


  //   console.log(id);
  //   // res.send("SUCCESS");
  //   db.Quotes.findAll({
  //     where: {
  //       quoteID: id
  //     },
  //     include: [db.User, db.Products],

  //   }).then(function (fetch) {
  //     var date = moment().format("DD/MM/YYYY");
  //     // console.log("NAME IS",fetch[0].User)
  //     var name = fetch[0].User.name;
  //     var email = fetch[0].User.email;
  //     //******START OF PDF GENERATION *******//
  //     var doc = new PDFDocument({
  //       margin: 50
  //     });
  //     //doc.pipe(fs.createWriteStream("output.pdf"));
  //     var filename = encodeURIComponent(id) + '.pdf';
  //     res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  //     res.setHeader('Content-type', 'application/pdf');
  //     generateHeader(doc);
  //     generateCustomerInformation(doc, id, name, date, email);
  //     generateInvoiceTable(doc, fetch)
  //     generateFooter(doc);
  //     doc.pipe(res);
  //     doc.end();

  //     //******END OF PDF GENERATION *******//

  //     function generateHeader(doc) {
  //       doc
  //         .image("./public/assets/img/HOME-Bayside-Logo-NEW.png", 50, 45, {
  //           width: 50
  //         })
  //         .fillColor("#444444")
  //         .fontSize(20)
  //         .text("Soiled INC.", 110, 57)
  //         .fontSize(10)
  //         .text("123 Main Street", 200, 65, {
  //           align: "right"
  //         })
  //         .text("Caufield, VIC, 3163", 200, 80, {
  //           align: "right"
  //         })
  //         .moveDown();
  //     }

  //     function generateFooter(doc) {
  //       doc
  //         .fontSize(10)
  //         .text(
  //           "This quote is valid for 30 days. Thank you for your business.",
  //           50,
  //           730, {
  //             align: "center",
  //             width: 500
  //           }
  //         );
  //     }

  //     function generateCustomerInformation(doc, id, name, date) {
  //       doc
  //         .fillColor("#444444")
  //         .fontSize(20)
  //         .text("QUOTE", 50, 160);

  //       generateHr(doc, 185);

  //       const customerInformationTop = 200;

  //       doc
  //         .fontSize(10)
  //         .text("Quote Number:", 50, customerInformationTop)
  //         .font("Helvetica-Bold")
  //         .text(id, 150, customerInformationTop)
  //         .font("Helvetica")
  //         .text("Quote Date:", 50, customerInformationTop + 15)
  //         .text(date, 150, customerInformationTop + 15)
  //         .font("Helvetica")
  //         .text("Name:", 300, customerInformationTop)
  //         .text(name, 350, customerInformationTop)
  //         .text("Email:", 300, customerInformationTop + 15)
  //         .text(email, 350, customerInformationTop + 15)
  //         .moveDown();

  //       generateHr(doc, 252);
  //     }

  //     function generateInvoiceTable(doc, fetch) {
  //       let i;
  //       const invoiceTableTop = 330;

  //       doc.font("Helvetica-Bold");
  //       generateTableRow(
  //         doc,
  //         invoiceTableTop,
  //         "Item",
  //         "Description",
  //         "Unit Cost",
  //         "Quantity",
  //         "Total Cost"
  //       );
  //       generateHr(doc, invoiceTableTop + 20);
  //       doc.font("Helvetica");
  //       var Total = 0;
  //       for (i = 0; i < fetch.length; i++) {
  //         var itemTotal = fetch[i].quantity * fetch[i].Product.price;

  //         Total += itemTotal
  //         const position = invoiceTableTop + (i + 1) * 30;
  //         generateTableRow(
  //           doc,
  //           position,
  //           fetch[i].Product.id,
  //           fetch[i].Product.name,
  //           formatCurrency(fetch[i].Product.price),
  //           fetch[i].quantity,
  //           formatCurrency(itemTotal)
  //         );

  //         generateHr(doc, position + 20);
  //       }

  //       const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  //       generateTableRow(
  //         doc,
  //         subtotalPosition,
  //         "",
  //         "",
  //         "Subtotal",
  //         "",
  //         formatCurrency(Total)
  //       );
  //     }

  //     function generateTableRow(
  //       doc,
  //       y,
  //       item,
  //       description,
  //       unitCost,
  //       quantity,
  //       lineTotal
  //     ) {
  //       doc
  //         .fontSize(10)
  //         .text(item, 50, y)
  //         .text(description, 150, y)
  //         .text(unitCost, 280, y, {
  //           width: 90,
  //           align: "right"
  //         })
  //         .text(quantity, 370, y, {
  //           width: 90,
  //           align: "right"
  //         })
  //         .text(lineTotal, 0, y, {
  //           align: "right"
  //         });
  //     }

  //     function formatCurrency(currency) {
  //       return "$" + currency;
  //     }

  //     function generateHr(doc, y) {
  //       doc
  //         .strokeColor("#aaaaaa")
  //         .lineWidth(1)
  //         .moveTo(50, y)
  //         .lineTo(550, y)
  //         .stroke();
  //     }
  //   });
  // });
};