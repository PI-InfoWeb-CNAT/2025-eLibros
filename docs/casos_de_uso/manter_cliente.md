# Projeto eLibros - Especificação de caso de uso INCOMPLETO

##  Manter cliente

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| dd/mm/2024 | **1.00** | Primeira versão  | Os Integradores |


### 1. Resumo 
Este caso de uso permite ao administrador do sistema gerenciar dados e realizar operações relacionadas aos usuários cadastrados (leitores).

### 2. Atores 
- Admin

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O usuário admin esta logado.

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Tenha realizado operações associadas ao Leitor

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. O Leitor aperta no botão de "adicionar ao carrinho"  | --- |
| ---                      | 2. Ação do sistema| 
|e assim por diante| oi |

#### 5.2. Fluxo de excessão

(Uma tabela para cada fluxo de excessão)

**EX:**

##### 5.2.1 Capa em branco OK
|  Ator  | Sistema |
|:-------|:------- |
|3. O admin não insere a Capa do livro e clica em "Cadastrar livro" | --- |
|--- |4. O sistema não valida os dados inseridos pelo admin e exibe uma mensagem de erro ("O campo 'Capa' é obrigatório") |

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
