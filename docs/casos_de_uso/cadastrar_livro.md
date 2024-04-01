# Projeto eLibros

## Especificação do caso de uso - Cadastrar livro

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| dd/mm/2024 | **1.00** | Primeira versão  | Cortez |


### 1. Resumo 
Este caso de uso permite que um leitor cadastre um livro no sistema.

### 2. Atores 
- Admin

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O leitor estar logado no sistema

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Armazene os dados do livro cadastrado e, portanto, permita a publicação de exemplares do livro

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. O Admin aperta no botão "+" e em seguida "Cadastrar livro" | --- |
| --- |2. O sistema redireciona o leitor para a página de cadastro de livro | --- |
|3. O admin insere os dados do livro a ser cadastrado (Capa, Título, Autor, Descrição, Gênero, Data de Publicação, ISBN, Editora, Edição, N° de Páginas e Idioma) | --- |
|--- |4. O sistema valida e armazena os dados cadastrados |
|5. O admin é redirecionado para a página do livro que acabou de cadastrar | --- |

#### 5.2. Fluxo de excessão

##### 5.2.1 Capa em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O admin não insere a Capa do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo admin e exibe uma mensagem de erro ("O campo 'Capa' é obrigatório") |

##### 5.2.2 Arquivo de Capa muito grande AVALIAR
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor insere um arquivo muito grande no campo 'Capa' e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O tamanho máximo de arquivo é 2 MB") |

##### 5.2.3 Título em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere o Título do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Título' é obrigatório") |

##### 5.2.4 Autor em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere o Autor do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Autor' é obrigatório") |

##### 5.2.5 Descrição em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere a Descrição do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Descrição' é obrigatório") |

##### 5.2.5 Descrição muito curta AVALIAR
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor insere uma Descrição muito curta e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Descrição' deve ser composto por, no mínimo, trinta caracteres") |

##### 5.2.6 Gênero em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere o Gênero do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Gênero' é obrigatório") |

##### 5.2.7 Data de Publicação em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere a Data de Publicação do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Data de Publicação' é obrigatório") |

##### 5.2.8 ISBN em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere o ISBN do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'ISBN' é obrigatório") |

##### 5.2.9 Editora em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere a Editora do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Editora' é obrigatório") |

##### 5.2.10 Edição em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere a Edição do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Edição' é obrigatório") |

##### 5.2.11 N° de Páginas em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere o N° de Páginas do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'N° de Páginas' é obrigatório") |

##### 5.2.12 Idioma em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O leitor não insere o Idioma do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo leitor e exibe uma mensagem de erro ("O campo 'Idioma' é obrigatório") |

### 6. Protótipos de Interface
imgs do site/figma referente a esse caso de uso

### 7. Diagrama de classe de domínio beta


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
