# Projeto eLibros - Especificação de caso de uso

## Utilizar diversos métodos de pagamento

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 15/05/2024 | **1.00** | Primeira versão  | Olga |


### 1. Resumo 
Esse caso de uso permite ao Cliente ter as opções de pagamento: crédito, débito, pix e boleto

### 2. Atores 
- Cliente

### 3. Pré-condições
Cliente deve estar na etapa de pagamento de uma compra que está sendo feita.
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Confirme o pagamento e permita que o processamento do pedido (e sua criação) inicie.

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
| 1. Cliente escolhe opção de pagamento e efetua operações associadas| --- |
| --- | 2. O sistema valida e confirma pagamento | 

#### 5.2. Fluxo de exceção

|  Ator  | Sistema |
|:-------|:------- |
| 1. Ocorre um erro na operação de algum tipo de pagamento| --- |
| --- | 2. O sistema não valida e não confirma pagamento | 

### 6. Protótipos de Interface



### 7. Diagrama de classe de domínio usados neste caso de uso

![image](https://github.com/user-attachments/assets/f2c3a638-5065-4681-bdc0-0f0f18ebc6f2)


### 8. Dicionário de dados
![image](https://github.com/user-attachments/assets/0c6ec90a-5b48-47fa-a574-b162183506da)

### 9. Regras de negócio
- A definir tamanho máximo de um comentário
