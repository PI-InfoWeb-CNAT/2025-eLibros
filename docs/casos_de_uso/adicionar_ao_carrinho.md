# Projeto eLibros - Especificação de caso de uso

##  Adicionar livro ao carrinho

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 01/04/2024 | **1.00** | Primeira versão  | Cortez |
| 09/04/2024 | **1.1** | Correção do histórico de revisão  | Cortez |
| 12/08/2024 | **1.2** | Correção de detalhes  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite o usuário adicionar um produto à cesta de compras.

### 2. Atores 
- Cliente ou Visitante

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- Não há.

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Armazene o novo item e sua quantidade selecionada na cesta de compras.

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página de um produto, o usuário clica no botão referente a adicionar ao carrinho| --- |
| --- |2. O sistema salva essa informação (nos cookies/session info no caso do visitante) e atualiza o icone de cesta de compras com a quantia atual | 


#### 5.2. Fluxo de excessão

##### 5.2.1 Loja não possui estoque
|  Ator  | Sistema |
|:-------|:------- |
|---|2. O sistema informa ao usuário que não há a quantia disponível requisitada de um item |

### 6. Protótipos de Interface
A ser desenvolvido.

### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido.

### 8. Dicionário de dados
- Capa - Arquivo de imagem 
- Título - Uma cadeia de caracteres alfabéticos tamanho 50
- Autor - Uma cadeia de caracteres alfabéticos tamanho 30
- Descrição - Uma cadeia de caracteres alfanuméricos tamanho 1000
- Gênero - Uma cadeia de caracteres alfabéticos tamanho 30
- Data de Publicação - Data do calendário em modelo MM/AAAA
- ISBN - Uma cadeia de 13 caracteres numéricos 
- Editora - Uma cadeia de caracteres alfabéticos tamanho 30
- Idioma - Uma cadeia de caracteres alfabéticos tamanho 30

### 9. Regras de negócio
- Capa - Arquivo de imagem de amanho máximo de 2 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP
