# Projeto eLibros - Especificação de caso de uso

##  Cancelar pedido

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 04/11/2024 | **1.10** | Adição de protótipo de interface  | Gabriel Campos |
| 02/02/2025 | **1.10** | Adição de diagrama de classe e dicionário de dados  | Gabriel Campos |



### 1. Resumo 
Esse caso de uso permite o usuário cancelar um pedido feito.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar cadastrado no sistema
- O cliente ter feito o pedido a ser cancelado
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Suspenda o pedido solicitado
- Atualize a lista de pedidos realizados

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de pedidos realizados, o usuário clica no botão referente a cancelar o pedido| --- |
| --- |2. O sistema retira o pedido da lista de pedidos realizados | 


#### 5.2. Fluxo de exceção

Não há exceção.

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/72ec8037-fc65-4b16-bd55-36254619f06f)


### 7. Diagrama de classe de domínio usados neste caso de uso
![image](https://github.com/user-attachments/assets/1fbb9adc-eff8-45dc-953c-5819b0a5e40a)



### 8. Dicionário de dados

![image](https://github.com/user-attachments/assets/5f78f810-4133-465d-a1f0-38c615f509b2)



### 9. Regras de negócio

