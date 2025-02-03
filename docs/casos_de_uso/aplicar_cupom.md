# Projeto eLibros - Especificação de caso de uso

##  Aplicar cupom

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 08/12/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 09/12/2024 | **1.10** | Adição de diagrama de classe de domínio  | Gabriel Campos |
| 02/02/2024 | **1.20** | Atualização de diagrama de classe de domínio e adição de dicionário de dados  | Gabriel Campos |



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
![image](https://github.com/user-attachments/assets/34d24594-0949-44f8-852e-eebeaeb2a29e)

### 8. Dicionário de dados
#### Cupom
![image](https://github.com/user-attachments/assets/fb98b5f5-2e0f-4d7a-bc09-4af21332c529)

#### Pedido
![image](https://github.com/user-attachments/assets/ecc2674a-6c3f-42c6-9256-d4f4cf16e01c)

