# Projeto eLibros - Especificação de caso de uso

##  Editar carrinho

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite ao Cliente editar seu carrinho de compras.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O usuário possuir itens em seu carrinho
  
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
A ser desenvolvido.

### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido.

### 8. Dicionário de dados

#### 8.1. Livro
- Capa - Arquivo de imagem
- Título - Uma cadeia de caracteres alfabéticos tamanho 100
- Autor - Uma cadeia de caracteres alfabéticos tamanho 100
- Descrição - Uma cadeia de caracteres alfanuméricos
- Gênero - Uma cadeia de caracteres alfabéticos tamanho 30
- Data de Publicação - Data do calendário em modelo MM/AAAA
- ISBN - Uma cadeia de 15 caracteres numéricos 
- Editora - Uma cadeia de caracteres alfabéticos tamanho 30

#### 8.2. Cliente
- Id_cliente - Atributo identificador do Cliente
- Username - Uma cadeia de caracteres alfabéticos tamanho 20
- Senha - Uma cadeia de caracteres alfanuméricos tamano 15
- Cpf - Uma cadeia de caracteres alfanuméricos tamanho 13
- Email - Uma cadeia de caracteres alfanuméricos tamanho 320
- Nome - Uma cadeia de caracteres alfanuméricos tamanho 100
- Dt_nasc - Data do calendário em modelo DD/MM/AAAA
- Gênero - Uma cadeia de caracteres alfabéticos tamanho 30
- Id_endereço - Código identificador da entidade Endereço


### 9. Regras de negócio

#### 9.1 Livro
- Capa - Arquivo de imagem de amanho máximo de 8 MB em algum dos seguintes formatos: PNG, JPG, JPEG, SVG, WEBP

#### 9.2 Cliente
- Email - Um conjunto de caracteres (com exceção dos caracteres especiais, sendo permitido apenas o ponto) seguidos, respectivamente, por um arroba, outro conjunto de letras e um ou mais domínios de topo
- Senha - Segredo deve ter no mínimo 8 caracteres alfanuméricos
