# Projeto eLibros - Especificação de caso de uso

##  Confirmar recebimento de pedido

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 04/11/2024 | **1.10** | Adição de protótipo de interface  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite ao usuário confirmar que recebeu um pedido.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar cadastrado no sistema
- O cliente ter feito o pedido a ser confirmado
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Atualize o status do pedido como recebido

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de pedidos realizados, o usuário clica no botão referente a confirmar recebimento de pedido| --- |
| --- |2. O sistema envia um pop-up perguntando se o pedido já foi entregue | 
|3. O usuário clica no botão referente a "Sim, foi entregue"| --- |
| --- |4. O sistema atualiza o status desse pedido como recebido |


#### 5.2. Fluxo de exceção

|3. O usuário clica no botão referente a "Não, cancelar"| --- |
| --- |4. O sistema manda o usuário de volta à tela de pedidos. |

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/2107d6ef-2f4f-4f4b-b647-2ffb4c4f58bc)
![image](https://github.com/user-attachments/assets/c93203e1-223f-4f60-af8a-261abacc1297)



### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido.

### 8. Dicionário de dados

#### 8.1. Pedido
- Status - Booleano
- numero_Pedido - Atributo identificador do Pedido


### 9. Regras de negócio

