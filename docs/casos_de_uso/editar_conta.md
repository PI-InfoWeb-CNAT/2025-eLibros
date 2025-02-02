# Projeto eLibros - Especificação de caso de uso

##  Editar conta

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 12/09/2024 | **1.00** | Primeira versão  | Gabriel Campos |
| 04/11/2024 | **1.10** | Adição de protótipo de interface  | Gabriel Campos |


### 1. Resumo 
Esse caso de uso permite ao Cliente editar sua conta.

### 2. Atores 
- Cliente

### 3. Pré-condições
São pré-condições para iniciar este caso de uso:
- O usuário possuir uma conta e estar cadastrado
  
### 4. Pós-condições
Após a execução deste caso de uso, espera que-se o sistema:
- Edite certos atributos do Cliente

### 5. Fluxos de evento

#### 5.1. Fluxo Principal 
|  Ator  | Sistema |
|:-------|:------- |
|1. Na página do Perfil do Cliente, o Cliente altera os possíveis atributos desejados e clica no botão de confirmar| --- |
| --- |2. O sistema atualiza os atributos alterados no banco de dados | 


#### 5.2. Fluxo de exceção

Não há fluxo de exceção.

### 6. Protótipos de Interface
![image](https://github.com/user-attachments/assets/7fb923a4-ad62-4c89-b444-45ad57a3f110)
![image](https://github.com/user-attachments/assets/920c7f3b-480c-4e33-ba06-7d9fa0feac93)
![image](https://github.com/user-attachments/assets/add9ae39-fb8f-48b2-9562-c3cd1ea876c1)





### 7. Diagrama de classe de domínio usados neste caso de uso
A ser desenvolvido.

### 8. Dicionário de dados

#### 8.1. Cliente
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

#### 9.1 Cliente
- Email - Um conjunto de caracteres (com exceção dos caracteres especiais, sendo permitido apenas o ponto) seguidos, respectivamente, por um arroba, outro conjunto de letras e um ou mais domínios de topo
- Senha - Segredo deve ter no mínimo 8 caracteres alfanuméricos
