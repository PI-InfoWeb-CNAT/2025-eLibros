document.addEventListener('DOMContentLoaded', () => { 
    const botao_select = document.querySelector('#select img')
    const select = document.getElementsByName('filtros')[0];
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
});