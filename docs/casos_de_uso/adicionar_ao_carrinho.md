# Projeto eLibros - Especificação de caso de uso

##  Adicionar livro ao carrinho

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 01/04/2024 | **1.00** | Primeira versão  | Cortez |
| 09/04/2024 | **1.10** | Correção do histórico de revisão  | Cortez |
| 12/08/2024 | **1.20** | Correção de detalhes  | Gabriel Campos |
| 06/09/2024 | **1.30** | Correção dicionário de dados | Cortez |
| 12/09/2024 | **1.40** | Correção ortográfica | Gabriel Campos |
| 16/09/2024 | **1.50** | Apenas cliente adiciona ao carrinho | Gabriel Campos |
| 04/11/2024 | **1.60** | Adição de protótipo de interface  | Gabriel Campos |
| 09/12/2024 | **1.70** | Adição de diagrama de classe de domínio  | Gabriel Campos |
| 02/02/2025 | **1.80** | Atualização de diagrama de classe de domínio e adição de dicionário de dados | Gabriel Campos |



### 1. Resumo 
Esse caso de uso permite o usuário adicionar um livro a cesta de compras.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar logado no sistema

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Armazene o livro e sua quantidade selecionada na cesta de compras.

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de um livro, o usuário clica no botão referente a adicionar ao carrinho| --- |
| --- |2. O sistema salva essa informação e atualiza o icone de cesta de compras com a quantia atual | 


#### 5.2. Fluxo de exceção

##### 5.2.1 Loja não possui estoque
|  Ator  | Sistema |
|:-------|:------- |
|---|2. O sistema informa ao usuário que não há a quantia disponível requisitada de um livro |

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/a36910d5-8b14-49aa-a12d-728c88e09dd1)


### 7. Diagrama de classe de domínio usados neste caso de uso
![image](https://github.com/user-attachments/assets/c0bc13cc-fb69-438c-8ef8-f1b55e226623)



### 8. Dicionário de dados
![image](https://github.com/user-attachments/assets/5e6c0d62-ef91-421b-a5f5-8f546474d1d9)
![image](https://github.com/user-attachments/assets/1be351f1-5871-4081-b70d-f9b37714189b)




### 9. Regras de negócio

#### 9.1 Livro
- Capa - Arquivo de imagem de amanho máximo de 8 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP

#### 9.2 Cliente
- Email - Um conjunto de caracteres (com exceção dos caracteres especiais, sendo permitido apenas o ponto) seguidos, respectivamente, por um arroba, outro conjunto de letras e um ou mais domínios de topo
- Senha - Segredo deve ter no mínimo 8 caracteres alfanuméricos
