# Projeto eLibros - Especificação de caso de uso

##  Acessar livro

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 16/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 04/11/2024 | **1.10** | Adição de protótipo de interface  | Gabriel Campos |
| 02/02/2025 | **1.20** | Adição de diagrama de classe e dicionário de dados  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite ao usuário acessar a página de um livro.

### 2. Atores 
- Cliente e Visitante

### 3. Pré-condições
Não há
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Mostre a página do livro acessado ao usuário

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de acervo, o usuário clica na aba referente a "pesquisar" e escreve o que deseja pesquisar| --- |
| --- |2. O sistema busca o texto no acervo e mostra os livros compatíveis | 


#### 5.2. Fluxo de exceção

##### 5.2.1 Não há livro ou autor com o nome pesquisado no acervo
|  Ator  | Sistema |
|:-------|:------- |
|---| --- |
| --- |2. O sistema avisa que no seu acervo não há livro ou autor com o livro  | 

### 6. Protótipos de Interface

![image](https://github.com/user-attachments/assets/92b62e4b-dabb-4d57-a8c9-5a376691735c)
![image](https://github.com/user-attachments/assets/161f4c98-73f4-4af6-81bb-9b21db9ed512)



### 7. Diagrama de classe de domínio usados neste caso de uso

![image](https://github.com/user-attachments/assets/bd7813a2-0dca-4b93-b689-01a8172815c2)


### 8. Dicionário de dados

![image](https://github.com/user-attachments/assets/495e9b79-e719-40bf-bf00-7aaa5d80ad60)
![image](https://github.com/user-attachments/assets/6cc527da-6a02-4911-a80e-3d0f9fab5db1)
![image](https://github.com/user-attachments/assets/48ca6b58-b471-403d-a10e-826065fffdf3)
![image](https://github.com/user-attachments/assets/8f563d98-a8b5-449d-8199-98015cc29d02)


### 9. Regras de negócio

#### 9.1 Livro
- Capa - Arquivo de imagem de amanho máximo de 8 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP
