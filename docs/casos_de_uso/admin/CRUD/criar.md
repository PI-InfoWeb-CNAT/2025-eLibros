# Projeto eLibros - Especificação de caso de uso 

##  Criar

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| dd/mm/2024 | **1.00** | Primeira versão  | Os Integradores |


### 1. Resumo 
Este caso de uso permite ao administrador do sistema criar instâncias de modelos Django.

### 2. Atores 
- Admin

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O usuário admin esta logado.

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Tenha criado alguma instância de um modelo Django

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. O Admin aperta no botão "adicionar" ou "criar" de algum objeto na página desse modelo | --- |
| ---                      | 2. O sistema exibe o formulário de criação da entidade| 
| 3. O Admin preenche os dados | --- |
| --- | 4. Sistema salva as informações e redireciona para página de listagem de instâncias do modelo |

#### 5.2. Fluxo de exceção


##### 5.2.1 Campo obrigatório em branco
|  Ator  | Sistema |
|:-------|:------- |
|3. O admin deixa algum dado obrigatório em branco no formulário de edição | --- |
|--- |4. O sistema salva os dados inseridos pelo admin e exibe uma mensagem de erro ("Campo "___" é obrigatório") |

- LIVRO

##### 5.2.2 Data de publicação de Livro no futuro
|  Ator  | Sistema |
|:-------|:------- |
|3. O admin informa a data de publicação e/ou o ano de publicação de um livro e insere um valor no futuro | --- |
|--- |4. O sistema não salva os dados inseridos pelo admin e exibe mensagens de erro |


- GÊNERO

##### 5.2.4 Gênero já cadastrado no sistema
|  Ator  | Sistema |
|:-------|:------- |
|3. O admin tenta adicionar um gênero usando um nome já cadastrado | --- |
|--- |4. O sistema não salva os dados inseridos pelo admin e exibe mensagem de erro |




### 6. Protótipos de Interface


### 7. Diagrama de classe de domínio usados neste caso de uso


### 8. Dicionário de dados




### 9. Regras de negócio

- Capa - Tamanho máximo de 8 MB
