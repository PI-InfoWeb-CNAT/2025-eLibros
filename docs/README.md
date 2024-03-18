# yLibros - Documento de visão

## Comércio Eletrônico

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 11/03/2024 | **1.0** | Primeira versão do documento  | Os Yntregadores |
| 11/03/2024 | **1.1** | Adição de requisitos  | Os Yntegradores |

## 1. Objetivo do Projeto 
**Projeto:** Plataforma de venda de livros (yLibros)
 
## 2. Descrição do problema 
| | |
|:-|:-|
| **_O problema_**    | Distribuição e venda de livros de nossa loja no país  |
| **_afetando_**      | Consumidores dessas mídias (Leitores) |
| **_cujo impacto é_**| Para adquirir um livro, o cliente é obrigado a ir presencialmente à uma loja. Assim, potenciais vendas são perdidas. |
| **_uma boa solução seria_** | Criação de uma plataforma (site) de venda de livros físicos |
| | |

## 3. Descrição dos usuários
| Nome | Descrição | Responsabilidades |
|:- |:- |:- |
| Administrador  | Usuário responsável por gerenciar as questões administrativas do site | - Manter catálogo <br> - Manter clientes <br> - Gerenciamento geral do sistema |
| Cliente   | Usuário cadastrado do site, quem forneceu seus dados e realiza compras de livros no site | - Efetuar compra <br> - Possuir cadastro <br> + As do Visitante |
| Usuário | Usuário sem login que tem acesso ao site | - Consultar acervo de livros <br> - Criar conta|

## 4. Descrição do ambiente dos usuários 
Sistema web, acessado por um navegador, podendo o dispositivo ser tablet, smartphone ou desktop
O tempo mínimo de realização de uma compra, após escolha de itens, será curto


## 5. Principais necessidades dos usuários
- Realizar compras de forma acessível e intuitiva
- Poder acompanhar o status do pedido, ou seja, se já saiu do estoque ou se já chegou ao endereço
- Buscar livros por título, autor, data e etc

## 6. Alternativas concorrentes
Saraiva, Livraria Leitura, Amazon livros…

## 7.	Visão geral do produto
- O site deve permitir o cadastro do usuário (Leitor)
- O Visitante deve poder buscar por um livro específico por filtros como título, autor, data de publicação e gênero
- Leitor herda as permissões de Visitante
- O Leitor pode comprar um livro
- O Leitor poderá ver o status de sua compra
- O Leitor pode usar cupons de desconto


## 8.	Requisitos funcionais
| Código | Nome | Descrição |
|:---  |:--- |:--- |
| F01	| Efetuar login usuário | O usuário possui conta no sistema
| F02	| Exibir catálogo	| Exibir os livros disponíveis
| F03	| Realizar compras	| Selecionar livro e comprá-lo
| F04	| Consultar status do pedido	| “A caminho”, “Chegou” 
| F05	| Controle de acesso do usuário	| Só usuários autenticados podem fazer compra
| F06	| Filtragem de produtos	| Busca de livro por filtros
| F07	| Adicionar ao carrinho	| Gerenciamento do sistema de carrinho
| F08	| Visualizar detalhes do livro	| Os usuários podem ver informações detalhadas sobre cada livro, como sinopse, autor, editora, data de publicação, avaliações dos usuários, etc
| F09	| Gerenciar lista de desejos	| Os usuários podem adicionar livros à sua lista de desejos para compra futura.
| F10	| Gerenciar perfil de usuário	| Os usuários podem editar suas informações pessoais, como endereço de entrega, informações de pagamento, senha, etc
| F11	| Acompanhar histórico de compras	| Os usuários podem visualizar um registro de todas as compras anteriores feitas no site
| F12	| Ofertas e descontos	| Os usuários podem ver e aproveitar ofertas especiais, descontos sazonais ou promoções de livros
| F13	| Gerenciamento de estoque	| Manter o controle do estoque de livros disponíveis e atualizar automaticamente o catálogo quando os itens estiverem esgotados
| F14	| Suporte ao cliente	| Sistema de suporte para responder às dúvidas dos usuários, resolver problemas com pedidos, etc
| F15 	| Avaliações e comentários	| Os usuários podem deixar avaliações e comentários sobre os livros que compraram, fornecendo feedback útil para outros usuários
| | | | 

## 9.	Requisitos não-funcionais
| Código | Nome | Descrição | Categoria | Classificação |
|:---  |:--- |:--- |:--- |:--- |
| NF01	| Armazenamento de senhas	| Senhas devem ser criptografadas no armazenamento | Segurança	| Obrigatório
| NF02	| Disponibilidade	| O site deve estar disponível 24h/7	| Confiabilidade	| Obrigatório
| NF03	| Backup e recuperação	| Salvamento periódico da DB	| Confiabilidade	| Obrigatório
| NF04	| Compatibilidade	| Site deve ter bom layout em diferentes dispositivos	| Portabilidade	| Desejável
| NF05	| Experiência do usuário	| O design do site deve ser intuitivo e amigável, proporcionando uma experiência de compra agradável para os usuários	| Usabilidade	| Desejável
| | | | 
