# Projeto eLibros - Especificação de caso de uso

##  Acessar livro

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 16/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 04/11/2024 | **1.10** | Adição de protótipo de interface  | Gabriel Campos |
| 02/02/2025 | **1.20** | Adição de dicionário de dados e diagrama de classe  | Gabriel Campos |



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
|1. Na página inicial ou na de acervo, o usuário clica no botão referente a "acessar livro"| --- |
| --- |2. O sistema manda o usuário para a página do livro | 


#### 5.2. Fluxo de exceção

Não há exceção.

### 6. Protótipos de Interface

![image](https://github.com/user-attachments/assets/327413a7-5a7a-4b2f-a4c5-9d5f5756b4ff)


### 7. Diagrama de classe de domínio usados neste caso de uso

![image](https://github.com/user-attachments/assets/32408104-9456-4428-b0fd-09f7117703bb)


### 8. Dicionário de dados

#### 8.1. Livro
![image](https://github.com/user-attachments/assets/45677599-e73b-480d-b9d6-b40771648e70)

### 9. Regras de negócio

#### 9.1 Livro
- Capa - Arquivo de imagem de amanho máximo de 8 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP
