# Projeto eLibros - Especificação de caso de uso

##  Realizar pedido

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 04/11/2024 | **1.10** | Adição de protótipo de interface  | Gabriel Campos |
| 08/12/2024 | **1.20** | Adição de diagrama de classe de domínio  | Gabriel Campos |

### 1. Resumo 
Esse caso de uso permite o usuário realizar o pedido dos itens que se encontram no seu carrinho.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar logado no sistema
- O cliente ter itens no carrinho de compra
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Registre um pedido para o cliente com os itens que se encontram no carrinho do cliente.
- Remova todos os itens que se encontram no carrinho de compras do cliente.

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. No carrinho de compra, o usuário clica no botão para confirmar pedido| --- |
| --- |2. O sistema solicita o endereço do destino dos itens e os dados de um cartão para o pagamento. | 
|3. O usuário preenche os dados e clica no botão de confirmação. | --- |
| --- |4. O sistema registra o pedido.  | 

#### 5.2. Fluxo de exceção
|  Ator  | Sistema |
|:-------|:------- |
|1. O usuário digita um número de cartão inválido.| --- |
| --- |2. O sistema informa que o número digitado é inválido e pede para verificar. | 

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/db2dc822-a62f-42c2-9d41-74f9bcc33695)

### 7. Diagrama de classe de domínio usados neste caso de uso
![image](https://github.com/user-attachments/assets/cd4cc313-5364-426d-8e59-fdf79ca29227)



### 8. Dicionário de dados

#### 8.1. Pedido
- Status - Booleano
- entregaEstimada - Data do calendário em modelo DD/MM/AAAA
- numero_Pedido - Atributo identificador do Pedido

### 9. Regras de negócio
