$(document).ready(function() {
    // need to UPDATE the  button  ID from the handlebars page
    $("#TO_BE_CONFIRMED").on("click", function(event) {
      event.preventDefault();
      var quoteData = {
        quantity: $("#TO_BE_CONFIRMED")
          .val()
          .trim()
      };
  
      console.log(quoteData);
  
      if (!quoteData.quantity) {
        return;
      }
  
      newQuote(quoteData.quantity);
      $("#TO_BE_CONFIRMED").val("");
    });
  
    function newQuote(quantity) {
      $.post("/api/quotes", {
        quantity: quantity
      })
        .then(function(data) {
          window.location.replace(data);
        })
        .catch(handleQuoteError);
    };
    function handleQuoteError(err) {
      alert(err.responseJSON);
      $("#alert").fadeIn(500);
    }
}