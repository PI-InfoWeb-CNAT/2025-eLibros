# Projeto eLibros - Especificação de caso de uso

##  Avaliar livro

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 15/05/2024 | **1.00** | Primeira versão  | Olga |



### 1. Resumo 
Esse caso de uso permite ao usuário avaliar um livro que tenha comprado com uma nota de 1 a 5 estrelas e um comentário textual opcional.

### 2. Atores 
- Cliente

### 3. Pré-condições
Cliente deve ter adiquirido o livro avaliado previamente
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Salve a avaliação feita pelo Cliente e a torne pública

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
| 1. Na página de determinado livro já comprado pelo cliente, esse clica no campo de "Avaliar este livro"| --- |
| --- | 2. O sistema habilita os campos de avaliação | 
| 3. O Cliente expressa sua avaliação quantitativamente com estrelinhas (ou algo similar) de 1 a 5 e qualitativamente, de modo opcional, com um comentário livre, para enfim clicar no botão "Publicar" | --- |
| --- | 4. O sistema salva as ações no banco de dados e torna visível a todos a avaliação feita |


#### 5.2. Fluxo de exceção

Não há exceção.

### 6. Protótipos de Interface



### 7. Diagrama de classe de domínio usados neste caso de uso

![image](https://github.com/user-attachments/assets/f2c3a638-5065-4681-bdc0-0f0f18ebc6f2)


### 8. Dicionário de dados
![image](https://github.com/user-attachments/assets/0c6ec90a-5b48-47fa-a574-b162183506da)

### 9. Regras de negócio
- A definir tamanho máximo de um comentário
