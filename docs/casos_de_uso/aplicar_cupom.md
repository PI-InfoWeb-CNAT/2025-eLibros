# Projeto eLibros - Especificação de caso de uso

##  Aplicar cupom

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 08/12/2024 | **1.00** | Primeira versão  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite ao usuário aplicar um cupom à sua compra

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar logado no sistema
- O cliente estar na página de finalização de compra
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Aplique um desconto à compra, baseado no Cupom

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de Finalizar Compra, o usuário clica no formulário referente a "Ofertas" e digita o código do seu cupom.| --- |
| --- |2. O sistema aplica o cupom à compra | 


#### 5.2. Fluxo de exceção

##### 5.2.1
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de Finalizar Compra, o usuário clica no formulário referente a "Ofertas" e digita um código inválido| --- |
| --- |2. O sistema não valida o código inserido e exibe uma mensagem de erro ("Este cupom expirou ou não existe.") |

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/c10b527b-2fa8-476b-8e05-f54ec5621f6d)

### 7. Diagrama de classe de domínio usados neste caso de uso

A ser desenvolvido.

### 8. Dicionário de dados
#### Cupom
- Ativo - Booleano
- Valor - Número inteiro que representa a porcentagem
#### Pedido
- Valor total- Número natural com duas casas decimais
