$(document).ready(function() {
    // need to UPDATE the  button  ID from the handlebars page
    $(".product-quote").on("click", function(event) {
      event.preventDefault();
      var prodNumber = $(this).attr("data-product");
      var qtyNumber = $(this).attr("#prod-1");
  
      // need to include a data attribute for the UserId (email)
      
      if (!qtyNumber) {
        return;
      }
      
      var quoteData = {
        quantity: qtyNumber,
        ProductId: prodNumber,
        UserId: UserId
      }

      newQuote(quoteData);
      $("prod-1").val("");
      $("data-product").val("");
    });
  
    function newQuote(quantity) {
      $.post("/api/quotes", quoteData)
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