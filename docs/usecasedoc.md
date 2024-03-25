Especificação de casos de uso

UC01- Criar conta
Descrição:
O usuário que não possui cadastro cria uma conta


Atores: 
Usuário não autenticado


Pré-condições:
O sistema de cadastro de usuários está disponível e funcional.
O usuário não possui uma conta registrada no sistema

Pós-condições:
O usuário deve possuir uma conta no sistema

Fluxo de evento:
Fluxo principal

|Ator| Sistema |
|--|--|
|O usuário decide criar uma conta e acessar a página de registro.| O sistema exibe o formulário de registro para o usuário preencher com suas informações. |
|O usuário preenche o formulário com seus dados pessoais, incluindo nome, email, senha, etc|O sistema valida os dados fornecidos pelo usuário, garantindo que estejam corretos e completos. |O sistema cria uma conta para o usuário com as informações fornecidas. 
| | O sistema cria uma conta para o usuário com as informações fornecidas.|
|| O sistema exibe uma mensagem de confirmação de sucesso e redireciona o usuário para a página inicial.|

Fluxo de exceção


Se algum campo obrigatório não for preenchido corretamente, o sistema exibe uma mensagem de erro e solicita ao usuário que corrija o problema.
	
Se o email fornecido pelo usuário já estiver associado a uma conta existente, o sistema exibe uma mensagem de erro indicando que o email já está em uso.	

Se ocorrer algum erro durante o processo de criação da conta, o sistema exibe uma mensagem de erro genérica e instrui o usuário a tentar novamente mais tarde.



	
UC0x- Adicionar item ao carrinho
Descrição:
O 


Atores: 
Usuário não autenticado


Pré-condições:
O sistema de cadastro de usuários está disponível e funcional.
O usuário não possui uma conta registrada no sistema

Pós-condições:
O usuário deve possuir uma conta no sistema

Fluxo de evento:
Fluxo principal

|Ator| Sistema |
|--|--|
|O usuário decide criar uma conta e acessar a página de registro.| O sistema exibe o formulário de registro para o usuário preencher com suas informações. |
|O usuário preenche o formulário com seus dados pessoais, incluindo nome, email, senha, etc|O sistema valida os dados fornecidos pelo usuário, garantindo que estejam corretos e completos. |O sistema cria uma conta para o usuário com as informações fornecidas. 
| | O sistema cria uma conta para o usuário com as informações fornecidas.|
|| O sistema exibe uma mensagem de confirmação de sucesso e redireciona o usuário para a página inicial.|

Fluxo de exceção


Se algum campo obrigatório não for preenchido corretamente, o sistema exibe uma mensagem de erro e solicita ao usuário que corrija o problema.
	
Se o email fornecido pelo usuário já estiver associado a uma conta existente, o sistema exibe uma mensagem de erro indicando que o email já está em uso.	

Se ocorrer algum erro durante o processo de criação da conta, o sistema exibe uma mensagem de erro genérica e instrui o usuário a tentar novamente mais tarde.


