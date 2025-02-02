document.addEventListener('DOMContentLoaded', function() {
    var confirmButtons = document.querySelectorAll('.confirmar');
    var closeButtons = document.querySelectorAll('.close');

    console.log(confirmButtons);
    console.log(closeButtons);

    confirmButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var pedidoId = btn.getAttribute('data-pedido-id');
            var modal = document.getElementById('modal_confirmar_' + pedidoId);
            modal.style.display = "block";
        });
    });

    closeButtons.forEach(function(span) {
        span.addEventListener('click', function() {
            var pedidoId = span.getAttribute('data-pedido-id');
            var modal = document.getElementById('modal_confirmar_' + pedidoId);
            modal.style.display = "none";
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal_confirmar')) {
            event.target.style.display = "none";
        }
    });
});