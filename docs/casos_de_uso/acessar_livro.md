# Projeto eLibros - Especificação de caso de uso

##  Acessar livro

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 16/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |


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

A ser desenvolvido.

### 7. Diagrama de classe de domínio usados neste caso de uso

A ser desenvolvido.

### 8. Dicionário de dados

#### 8.1. Livro
- Capa - Arquivo de imagem
- Título - Uma cadeia de caracteres alfabéticos tamanho 100
- Autor - Uma cadeia de caracteres alfabéticos tamanho 100
- Preço - Um número com duas casas decimais

### 9. Regras de negócio

#### 9.1 Livro
- Capa - Arquivo de imagem de amanho máximo de 8 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP
