
# Projeto eLibros - Especificação de caso de uso

## Calcular frete e estimativa de entrega

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 15/05/2024 | **1.00** | Primeira versão  | Olga |


### 1. Resumo 
Esse caso de uso permite ao Cliente calcular o frete e estimativa de entrega de um livro específico ou de um carrinho que foi fechado e está na fase de pagamento.

### 2. Atores 
- Cliente ou Visitante

### 3. Pré-condições
Cliente ou Visitante deve estar na página de um livro ou
Cliente (apenas) deve estar na etapa de pagamento de uma compra que está sendo feita.
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Exiba valor de frete e tempo estimado de entrega para cada opção encontrada de envio.

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
| 1. Cliente ou Visitante informa cep | --- |
| --- | 2. O sistema valida o cep e exibe a lista de opções de entrega para o item específico, calculando o preço|

#### 5.2. Fluxo Alternativo 
|  Ator  | Sistema |
|:-------|:------- |
| 1. Cliente informa cep de endereço não cadastrado no momento da compra | --- |
| --- | 2. O sistema valida o cep e endereço e exibe a lista de opções de entrega | 

#### 5.3. Fluxo de exceção

|  Ator  | Sistema |
|:-------|:------- |
| 1. Cliente ou Visitante informa cep inválido | --- |
| --- | 2. O sistema retorna mensagem de erro | 

### 6. Protótipos de Interface



### 7. Diagrama de classe de domínio usados neste caso de uso

![image](https://github.com/user-attachments/assets/f2c3a638-5065-4681-bdc0-0f0f18ebc6f2)


### 8. Dicionário de dados
![image](https://github.com/user-attachments/assets/0c6ec90a-5b48-47fa-a574-b162183506da)

### 9. Regras de negócio
- A definir tamanho máximo de um comentário
