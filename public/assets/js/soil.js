var modal = document.getElementById("id01");

window.onlick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


$(".pdf").on("click", function (event) {
       
  var id= "Q111"

var URL='/pdf/'+id;
$.ajax(URL, {
      type: "GET",
  })
  //We get the reponse of the answers send reload the page
  .then(
      function (response) {
           console.log(response);

      }
  );
});

