document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const botao_select = document.querySelector('.select img')
    const select = document.getElementById('filtros')
    const genreSelect = document.getElementById('genero');
    const writerSelect = document.getElementById('autor');
    const yearSelect = document.getElementById('data');
    const options = select.options;

    if(select && botao_select){
        
        select.addEventListener('change', () => {
            let index = options.selectedIndex;
            botao_select.style.visibility = index === 0 ? 'visible' : 'hidden';
        });

        let index = options.selectedIndex;
        
        if (index == 0) {
            botao_select.addEventListener('click', () => {
                options[0].innerHTML = options[0].innerHTML == 'A-Z' ? 'Z-A' : 'A-Z';
                options[0].value = options[0].value == 'asc' ? 'desc' : 'asc';
            });
        }
    }

    [select, genreSelect, writerSelect, yearSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', () => form.submit());
        }
    });

    const searchInput = document.getElementById('search-bar1');
    if (searchInput) {
        searchInput.value = new URLSearchParams(window.location.search).get('pesquisa') || '';
    }
});