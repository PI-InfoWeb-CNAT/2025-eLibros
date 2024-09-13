# Projeto eLibros - Especificação de caso de uso

##  Confirmar recebimento de pedido

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |


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
| --- |2. O sistema atualiza o status desse pedido como recebido | 


#### 5.2. Fluxo de exceção

Não há exceção.

### 6. Protótipos de Interface
A ser desenvolvido.

### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido.

### 8. Dicionário de dados

#### 8.1. Pedido
- Status - Booleano
- numero_Pedido - Atributo identificador do Pedido


### 9. Regras de negócio

