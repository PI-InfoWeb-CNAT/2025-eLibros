document.addEventListener('DOMContentLoaded', () => {
  
  botoes_adicionar_remover = document.querySelectorAll('.quantity-btn');
  console.log(botoes_adicionar_remover)

  if (botoes_adicionar_remover.length !== 0) {
    botoes_adicionar_remover.forEach(botao => {

      botao.addEventListener('click', () => {
        let input = botao.parentElement.querySelector('input');
        let value = parseInt(input.value);
        let max = parseInt(input.getAttribute('max'));
        let min = parseInt(input.getAttribute('min'));

        if (botao.classList.contains('plus')) {
          if (value < max) {
            input.value = value + 1;
          }
        } else if (botao.classList.contains('minus')) {
          if (value > min) {
            input.value = value - 1;
          }
        }
      });

    });

    
  }
 

const selectAllCheckbox = document.getElementById('myCheckbox');
const checkboxes = document.querySelectorAll('.custom-checkbox');

if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', () => {
    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });
}



});