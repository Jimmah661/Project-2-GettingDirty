var modal = document.getElementById('id01');

window.onlick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};