document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementsByClassName("modal_confirmar")[0];
  var btn = document.getElementsByClassName("confirmar")[0];
  var span = document.getElementById("close");

  // When the user clicks on the button, open the modal
  btn.addEventListener('click', function() {
      modal.style.display = "block";
  });

  // When the user clicks on <span> (x), close the modal
  span.addEventListener('click', function() {
      modal.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener('click', function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  });
});