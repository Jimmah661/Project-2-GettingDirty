var modal = document.getElementById("id01");

window.onlick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
$(document).ready(function () {
  // need to UPDATE the  button  ID from the handlebars page
  //   $(".product-quote").on("click", function(event) {
  //     event.preventDefault();
  //     var prodNumber1 = $(this).attr("data-product1");
  //       var qtyNumber1 = $("#prod-1").val();
  //       var qtyNumber2 = $("#prod-2").val();
  //       var qtyNumber3 = $("#prod-3").val();
  //     var prodNumber2 = $(this).attr("data-product2");
  //     var prodNumber3 = $(this).attr("data-product3");
  // console.log(qtyNumber3);
  // console.log(qtyNumber2);
  // console.log(qtyNumber1);
  // console.log(prodNumber1);
  // console.log(qtyNumber1);
  // console.log(prodNumber2);
  // console.log(qtyNumber2);
  // console.log(qtyNumber3);
  //     // need to include a data attribute for the UserId (email)

  //     if (!qtyNumber) {
  //       return;
  //     }

  //     var quoteData = {
  //       quantity: qtyNumber,
  //       ProductId: prodNumber,
  //       UserId: "stephen"
  //     }

  //     newQuote(quoteData);
  //     // $("prod-1").val("");
  //     // $("data-product").val("");
  //   });

  // function newQuote(quoteData) {
  //   $.post("/api/quotes", quoteData)
  //     .then(function (data) {
  //       window.location.replace(data);
  //     })
  //     .catch(handleQuoteError);
  // };

  // function handleQuoteError(err) {
  //   alert(err.responseJSON);
  //   $("#alert").fadeIn(500);
  // }


  $(".product-quote").on("click", function (event) {
    event.preventDefault();
    var answers = {
      qtyNumber1: $("#prod-1").val(),
      qtyNumber2: $("#prod-2").val(),
      qtyNumber3: $("#prod-3").val(),
      prodNumber1: $("#prod-1").attr("data-product1"),
      prodNumber2: $("#prod-2").attr("data-product2"),
      prodNumber3 :$("#prod-3").attr("data-product3")
    }

  

    var URL = '/pdf';
    $.ajax(URL, {
        type: "POST",
        data: answers,
        xhrFields: {
          responseType: 'blob'
        },

      })
      //We get the reponse of the answers send reload the page
      .then(
        function (response) {
          console.log(response);
          var blob = new Blob([response], {
            type: 'application/pdf'
          });
          let link = document.createElement('a');
          let objectURL = window.URL.createObjectURL(blob);
          link.href = objectURL;
          link.target = '_self';
          link.download = "Quote.pdf";
          (document.body || document.documentElement).appendChild(link);
          link.click();
        }
      );
  });

});
