# Projeto eLibros - Especificação de caso de uso

##  Adicionar livro ao carrinho

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| dd/mm/2024 | **1.00** | Primeira versão  | Cortez |


### 1. Resumo 
Esse caso de uso permite o Leitor adicionar um produto à cesta de compras.

### 2. Atores 
- Leitor ou Visitante

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
|1. Na página de um produto, o Leitor clica no botão referente a adicionar ao carrinho| --- |
| --- |2. O sistema salva essa informação (nos cookies/session info no caso do visitante) e atualiza o icone de cesta de compras com a quantia atual | 


#### 5.2. Fluxo de excessão

##### 5.2.1 Loja não possui estoque
|  Ator  | Sistema |
|:-------|:------- |
|---|2. O sistema informa ao usuário que não há a quantia disponível requisitada de um item |

### 6. Protótipos de Interface
imgs do site/figma referente a esse caso de uso

### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido pelo aluno.

### 8. Dicionário de dados
Em linhas gerais, informa o tipo e/ou tamanho suportado para um atributo


**Ex.:<br>**
- Capa - Arquivo de imagem (PNG, JPG, JPEG, SVG, WEBP)
- Título - Uma cadeia de caracteres alfabéticos tamanho 50

### 9. Regras de negócio
São "restrições específicas". <br>
Por exemplo, o tamanho máximo da capa impacta diretamente no hardware necessário para gerenciar essas imagens, consequentemente, afetando o custo financeiro

**ex.:**
- Capa - Tamanho máximo de 2 MB
