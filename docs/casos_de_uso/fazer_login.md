# Projeto eLibros - Especificação de caso de uso

##  Fazer login

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-----|:-------|:----------|:------|
| 08/04/2024 | **1.00** | Primeira versão  | Ana Júlia |
| 06/09/2024 | **1.10** | Atualização dicionário de dados e correção nomenclatura do ator | Cortez
| 04/11/2024 | **1.20** | Adição de protótipo de interface  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite o usuário cadastrado (Cliente) fazer login.

### 2. Atores 
Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O cliente estar cadastrado no sistema

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Permite ao cliente a autenticação e acesso às funcionalidades protegidas, como salvar o estado do carrinho e realizar uma compra

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Usuário clica no botão de login | --- |
| --- |2. Sistema direciona usuário para a página de login |
|3. Usuário insere dados de login | --- |
| --- |4. Sistema valida os dados inseridos |
|5. Usuário é autenticado | --- |

#### 5.2. Fluxo de excessão

##### 5.2.1 Email em branco
|  Ator  | Sistema |
|:-------|:------- |
|3. Usuário não insere seu email e clica em "Login" | --- |
|--- |4. O sistema não valida os dados inseridos pelo admin e exibe uma mensagem de erro ("O campo 'Email' é obrigatório") |

##### 5.2.2 Senha em branco
|  Ator  | Sistema |
|:-------|:------- |
|3. Usuário não insere sua senha e clica em "Login" | --- |
|--- |4. O sistema não valida os dados inseridos pelo admin e exibe uma mensagem de erro ("O campo 'Senha' é obrigatório") |

##### 5.2.3 Email e/ou senha incorretos
|  Ator  | Sistema |
|:-------|:------- |
|3. Usuário erra algum dado de login | --- |
|--- |4. O sistema não valida os dados inseridos pelo admin e exibe uma mensagem de erro ("Email e/ou senha inválido(s). Tente novamente") |

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/2afd7368-f735-4fcd-8bd3-4a2f2455a238)
![image](https://github.com/user-attachments/assets/1660c1bd-4296-4108-8653-8686d6626690)



### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido pelo aluno.

### 8. Dicionário de dados
- Username - Uma cadeia de caracteres alfanuméricos tamanho 20
- Senha - Uma cadeia de caracteres alfanuméricos e especiais tamanho 15

### 9. Regras de negócio
- Email - Conjunto de caracteres alfanuméricos separando usuário de domínio por meio de um arroba@). São permitidos os caracteres especiais hífen(-) e ponto(.) antes do arroba(@).
- Senha - Conjunto de caracteres alfanuméricos e especiais com mínimo de 8 caracteres
