# Projeto eLibros - Especificação de caso de uso

##  Editar carrinho

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 16/09/2024 | **1.10** | Correções  | Gabriel Campos |
| 04/11/2024 | **1.30** | Adição de protótipo de interface  | Gabriel Campos |
| 09/12/2024 | **1.40** | Adição de diagrama de classe de domínio  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite ao Cliente editar seu carrinho de compras.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar logado no sistema
- O cliente possuir itens em seu carrinho
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Atualize a quantidade de itens do carrinho em função do que o Cliente pediu

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página do carrinho, o Cliente clica na caixa referente a quantidade de certo item e o altera| --- |
| --- |2. O sistema atualiza a quantidade do item | 


#### 5.2. Fluxo de exceção

##### 5.2.1 Loja não possui estoque suficiente para cobrir a quantidade
|  Ator  | Sistema |
|:-------|:------- |
|---|2. O sistema informa ao usuário que não há a quantia disponível requisitada do item |

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/2e549f4a-4e64-4d0a-9d7c-8bf1d22841fd)


### 7. Diagrama de classe de domínio usados neste caso de uso
![image](https://github.com/user-attachments/assets/c7301ff2-2a91-4183-b99c-437579eb8855)



### 8. Dicionário de dados

#### 8.1. Carrinho
![image](https://github.com/user-attachments/assets/084b39e9-adab-4c61-8aae-30d3e3990415)


#### 8.2. ItemCarrinho
![image](https://github.com/user-attachments/assets/4da7b409-db16-4deb-a715-3e65fd19e8d5)



### 9. Regras de negócio

#### 9.1 Livro
- Capa - Arquivo de imagem de amanho máximo de 8 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP

#### 9.2 Cliente
- Email - Um conjunto de caracteres (com exceção dos caracteres especiais, sendo permitido apenas o ponto) seguidos, respectivamente, por um arroba, outro conjunto de letras e um ou mais domínios de topo
- Senha - Segredo deve ter no mínimo 8 caracteres alfanuméricos
