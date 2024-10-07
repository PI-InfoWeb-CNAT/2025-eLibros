document.addEventListener('DOMContentLoaded', () => {

  const quantityInputs = document.querySelectorAll('.input_quantia_produtos');
  const quantityForms = document.querySelectorAll('.quantity-form');

  quantityInputs.forEach(input => {
      input.addEventListener('change', () => {
          input.closest('form').submit();
      });
  });

  window.addEventListener('beforeunload', () => {
      quantityForms.forEach(form => {
          form.submit();
      });
  });


  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
        const quantityInput = this.parentElement.querySelector('input');
        let currentValue = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.getAttribute('max'));
        const min = parseInt(quantityInput.getAttribute('min'));

        if (this.classList.contains('minus') && currentValue > min) {
            quantityInput.value = currentValue - 1;
          } else if (this.classList.contains('plus') && currentValue < max) {
            quantityInput.value = currentValue + 1;
          }
        
          
        quantityInput.dispatchEvent(new Event('change'));
  
        if (document.getElementById('hidden_quantity') != null){
            document.getElementById('hidden_quantity').value = quantityInput.value;
        }
        console.log('Valor do elemento js selecionado: '+ quantityInput.value);
        
    });
  });
 

  

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