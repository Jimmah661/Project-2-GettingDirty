$(".pdf").on("click", function (event) {

  var id= "Q111"

var URL='/pdf/'+id;
$.ajax(URL, {
      type: "GET",
      xhrFields: {
        responseType: 'blob'
    },

  })
  //We get the reponse of the answers send reload the page
  .then(
      function (response) {
           console.log(response);
           var blob = new Blob([response],{ type: 'application/pdf' });
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