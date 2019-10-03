$(document).ready(function() {
  $("#registerButton").on("click", function(event) {
    event.preventDefault();
    var userData = {
      email: $("#orangeForm-email")
        .val()
        .trim(),
      name: $("#orangeForm-name")
        .val()
        .trim(),
      password: $("#orangeForm-pass")
        .val()
        .trim()
    };

    console.log(userData);

    if (!userData.email || !userData.name || !userData.password) {
      return;
    }

    signUpUser(userData.email, userData.name, userData.password);
    $("#orangeForm-email").val("");
    $("#orangeForm-name").val("");
    $("#orangeForm-pass").val("");
  });

  function signUpUser(email, name, password) {
    $.post("/api/signup", {
      email: email,
      name: name,
      password: password
    })
      .then(function(data) {
        window.location.replace(data);
      })
      .catch(handleLoginErr);
  }
  function handleLoginErr(err) {
    alert(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  $("#logMeIn").on("click", function(event) {
    event.preventDefault();
    var email = $("input#defaultForm-email");
    var password = $("input#defaultForm-pass");
    var userData = {
      email: email.val().trim(),
      password: password.val().trim()
    };
    console.log(userData);
    if (!userData.email || !userData.password) {
      return;
    }

    loginUser(userData.email, userData.password);
    email.val("");
    password.val("");
  });

  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function(data) {
        window.location.replace(data);
        console.log("Posted");
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});
