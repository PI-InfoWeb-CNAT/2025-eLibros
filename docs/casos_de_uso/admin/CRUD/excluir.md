# Projeto eLibros - Especificação de caso de uso 

##  Excluir

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 13/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |


### 1. Resumo 
Este caso de uso permite ao administrador do sistema excluir instâncias de modelos Django.

### 2. Atores 
- Admin

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O usuário admin esta logado.

### 4. Pós-condições
Após a execução deste caso de uso, espera que o sistema:
- Tenha excluído a(s) instância(s) de um modelo Django desejadas

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. O Admin aperta no botão "excluir" de algum objeto na página desse modelo | --- |
| ---                      | 2. O sistema exibe a página de confirmação de exclusão| 
| 3. O Admin aperta no botão "sim" | --- |
| --- | 4. Sistema salva a instância do modelo |

#### 5.2. Fluxo de exceção


##### 5.2.1 Admin cancela a ação de excluir
|  Ator  | Sistema |
|:-------|:------- |
|3. O Admin aperta no botão "não" | --- |
|--- |4. O sistema volta para a página "Manter" do modelo |



### 6. Protótipos de Interface


### 7. Diagrama de classe de domínio usados neste caso de uso


### 8. Dicionário de dados




### 9. Regras de negócio
