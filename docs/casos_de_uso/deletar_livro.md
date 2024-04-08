# Projeto eLibros - Especificação de caso de uso

## Admin excluir livro

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 08/04/2024 | **1.00** | Primeira versão  | Cortez |

### 1. Resumo 
Esse caso de uso permite a exclusão de um livro do sistema.

### 2. Atores 
- Admin

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O admin estar logado no sistema
- Haver pelo menos um livro cadastrado

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Remova o livro desejado do banco de dados

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
| --- | 1. Sistema exibe livros cadastrados |
| 2. Admin seleciona livro desejado | --- |
| --- | 3. Sistema exibe mensagem de confirmação |
| 4. Admin confirma | --- |
| --- | 5. Livro é excluído |

#### 5.2. Fluxo de excessão

##### 5.2.1 Admin não confirma exclusão do livro
|  Ator  | Sistema |
|:-------|:------- |
| 4. O admin desiste de excluir o livro | --- |
|--- | 5. O livro não é excluído |

### 6. Protótipos de Interface
imgs do site/figma referente a esse caso de uso

### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido pelo aluno.

### 8. Dicionário de dados
- Capa - Arquivo de imagem (PNG, JPG, JPEG, SVG, WEBP)
- Título - Uma cadeia de caracteres alfabéticos tamanho 50
- Autor - Uma cadeia de caracteres alfabéticos tamanho 30
- Descrição - Uma cadeia de caracteres alfanuméricos tamanho 1000
- Gênero - Uma cadeia de caracteres alfabéticos tamanho 30
- Data de Publicação - Data do calendário em modelo MM/AAAA
- ISBN - Uma cadeia de 13 caracteres numéricos 
- Editora - Uma cadeia de caracteres alfabéticos tamanho 30
- Idioma - Uma cadeia de caracteres alfabéticos tamanho 30

### 9. Regras de negócio
- Capa - Tamanho máximo de 2 MB
