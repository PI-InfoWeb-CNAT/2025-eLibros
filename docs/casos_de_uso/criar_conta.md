# Projeto eLibros - Especificação de caso de uso

##  Criar conta

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 15/08/2024 | **1.00** | Primeira versão  | Os Integradores |


### 1. Resumo 
Este caso de uso permite ao visitante a criação de conta no eLibros.

### 2. Atores 
- Visitante

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- Visitante não deve possuir cadastro na loja, ou seja, se tentar logar com um email de sua posse e senha, a autenticação e autorização aos recursos falhará.

### 4. Pós-condições
Após a execução deste caso de uso, espera-se que:
- Cliente possa efetuar compra, ter acesso aos livros salvos no carrinho entre sessões...

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Visitante clica no botão "Cadastrar"  | --- |
| ---                                     | 2. Sistema redireciona para interface de cadastro | 
|3. Visitante fornece email e senha | --- |
| --- | 4. Conta é criada com sucesso |

#### 5.2. Fluxo de excessão

**EX:**

##### 5.2.1 Valor em branco
|  Ator  | Sistema |
|:-------|:------- |
|3. Visitante não preenche um ou mais campos de dados | --- |
|--- |4. O sistema exibe mensagem de aviso "Campo não pode ser vazio" |

### 6. Protótipos de Interface
imgs do site/figma referente a esse caso de uso

### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido pelo aluno.

### 8. Dicionário de dados
Em linhas gerais, informa o tipo e/ou tamanho suportado para um atributo
- Email - Uma cadeia de caracteres alfanuméricos tamanho 320
- Senha - Uma cadeia de caracteres alfanuméricos tamanho 70

### 9. Regras de negócio
-   E-mail - Um conjunto de caracteres (com exceção dos caracteres especiais, sendo permitido apenas o ponto) seguidos, respectivamente, por um arroba, outro conjunto de letras e um ou mais domínios de topo
-   Senha - Mínimo de 8 caracteres; pelo menos uma letra maiúscula e minúscula; um número; um caractere especial
