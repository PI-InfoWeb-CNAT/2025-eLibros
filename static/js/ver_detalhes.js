document.addEventListener('DOMContentLoaded', () => { 
    const botoesVer = document.querySelectorAll('.botao-ver-detalhes');
    const botoesOcultar = document.querySelectorAll('.botao-ocultar-detalhes');
    
    function toggleDetalhes(pedidoId, show) {
        const div = document.getElementById('detalhes-pedido-' + pedidoId);
        console.log('Toggle div:', div);
        console.log('Current display:', div.style.display);
        
        if (show) {
            div.style.display = 'flex';
        } else {
            div.style.display = 'none';
        }
        
        console.log('New display:', div.style.display);
    }

    botoesVer.forEach(botao => {
        botao.addEventListener('click', () => {
            const pedidoId = botao.getAttribute('data-pedido-id');
            console.log('Showing details for pedido:', pedidoId);
            toggleDetalhes(pedidoId, true);
        });
    });

    botoesOcultar.forEach(botao => {
        botao.addEventListener('click', () => {
            const pedidoId = botao.getAttribute('data-pedido-id');
            console.log('Hiding details for pedido:', pedidoId);
            toggleDetalhes(pedidoId, false);
        });
    });
});