### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 01/06/2021 | **1.00** | Versão Inicial  | George Azevedo |
| 11/03/2024 | **1.00** | Primeira versão do documento  | Os Intregadores |

## 1. Objetivo do Projeto 
`A ser desenvolvido pelo aluno.` Este projeto tem objetivo de desenvolver um site que implemente as funcionalidades de uma loja on-line.
**Projeto**: Plataforma de venda de livros (eLibros)

## 2. Descrição do problema 
| | |
|:-|:-|
| **_O problema_**    | O lojista que atua no comércio convencional deseja resolver o problema de volume reduzido de vendas de seus produtos agravado pela situação de Pandemia  |
| **_afetando_**      | a capacidade de venda da loja                      |
| **_cujo impacto é_**| expansão ou até capacidade de existência da loja                                    |
| **_uma boa solução seria_** | Realizar vendas via internet e gerenciar o processo de entrega dos produtos |
| **_O problema_**    | Distribuição e venda de livros de nossa loja no país  |
| **_afetando_**      | Consumidores dessas mídias (Leitores) |
| **_cujo impacto é_**| Para adquirir um livro, o cliente é obrigado a ir presencialmente à uma loja.
Assim, potenciais vendas são perdidas. |
| **_uma boa solução seria_** | Criação de uma plataforma (site) de venda de livros físicos |
| | |

## 3. Descrição dos usuários
| Nome | Descrição | Responsabilidades |
|:- |:- |:- |
| Administrador  | Gestor da Loja; Usuário responsável pelos processos que irão permitir que os clientes adquiram os produtos com uso no site de vendas e acompanhem o processo de entrega dos pedidos realizados | Cadastrar os produtos e seus preços de venda; Cadastrar grupo de produtos e fabricantes; Disponibilizar ou bloquear a apresentação do produto no site de venda; Verificar as vendas realizados no período que ainda não foram remetidas aos clientes; Registra informações de envio dos pedidos aos clientes; Registra informação de controle de pagamento de pedidos|
| Usuário   | Usuário que visualiza o site; O usuário deve ter a possibilidade de obter informações acerca dos produtos vendidos e seus preços, sem a necessidade de registrar suas informações cadastrais no site | O usuário deve poder consultar os produtos por várias opções de  busca de forma a facilitar que ele encontre os produtos desejados; Deverá ser possível também montar uma cesta de compras com os itens que deseja adquirir; Caso deseje, poderá criar um registro de usuário com senha de forma a possibilitar o acesso a área de realização de pedidos de produtos e acompanhamento de entrega |
| Cliente | Usuário cadastrado; O usuário, após realizar seu cadastro no site, poderá realizar compras | Após a realização a inclusão de dados cadastrais tais como login, senha e endereço, o usuário passa a ser visto como cliente e poderá registrar seus pedidos. Os pedidos poderão ser compostos por um ou mais produtos e deverão incluir suas respectivas quantidades adquiridas. O valor total do pedido deve ser apresentado. O cliente deve ter acesso às seguintes funcionalidades no site: Alterar seus dados cadastrais informando novo endereço; Visualizar seu histórico de pedidos e observar a situação dos mesmos; Visualizar a situação da entrega dos pedidos; Cancelar o pedido; Avaliar os produtos adquiridos|
## 4. Descrição do ambiente dos usuários 
O comércio eletrônico tem dois tipos de usuários. O tipo administrador representa o gestor da loja e seus colaboradores e o tipo Cliente que representa o cliente, seja ele anônimo ou já cadastrado. 
O administrador acessará o site a partir do ambiente físico da loja e fará a configuração dos produtos a serem vendidos e realizará a logística de atendimento dos pedidos coletados pelo site, registrando a informação de situação de envio dos pedidos. Nesse processo, os produtos que forem identificados fisicamente sem estoque deverão ter sua disponibilidade para venda bloqueada.
O usuário cliente irá acessar o site utilizando  um computador ou celular e realizará a visualização dos produtos vendidos na loja e realizará a compra, caso deseje. Neste caso não há muitas restrições quanto ao ambiente pois ele poderá fazer os pedidos de qualquer local que tenha conexão com internet.
## 5. Principais necessidades dos usuários
Considerando o pronto de vista do lojista, administrador do site, sua principal necessidade é aumentar o volume de vendas de sua loja incorporando em seu negócio a possibilidade de realização de vendas via internet. 
Considerando o pronto de vista do cliente, ele deseja ter acesso a um site com interface amigável que permita obter informações sobre os produtos comercializados e, caso identifique que estes atendam às suas necessidades, ele possa montar sua relação de compra confirmando a aquisição. Após essa etapa ele desejará visualizar o processo de entrega dos produtos adquiridos.
## 6. Alternativas concorrentes
Uma alternativa ao comércio eletrônico desenvolvido é a lojas Americanas, que apresenta pesquisa por meio de nome ou categoria do produto, tem o sistema de carrinho de compras, que permite adicionar os produtos selecionados, deixando o pagamento somente para o final quando o cliente tiver selecionado todos os produtos desejados. Também tem o sistema de login, o qual o usuário se cadastra, o que facilita as próximas compras. Além disso em cada produto tem sua descrição, produto similares ao selecionado e uma seção destinada à avaliação dos consumidores. 
## 7.	Visão geral do produto
Esse projeto consiste em um site voltado para vendas de produtos que pretende funcionar de forma rápida e eficiente, disponibilizando um ambiente acessível a diversos tipos de usuários e possuindo um design confortável. Para tal, o site irá disponibilizar diferentes mecanismos de busca permitindo que o usuário encontre de forma eficiente o que ele precisa. Após a aquisição, o usuário poderá acompanhar o produto comprado, avaliar produtos da loja, comentar e marcar produtos como favoritos. 
## 8.	Requisitos funcionais
| Código | Nome | Descrição |
|:---  |:--- |:--- |
| F01	| Adicionar, remover ou alterar produtos | O administrador tem à sua disponibilidade a função de adicionar, remover ou alterar produtos comercializados no site estabelecendo ainda seus preços de venda. 
| F02	| Adicionar, remover ou alterar grupos de produtos.	| O administrador tem à sua disponibilidade a função de adicionar, remover ou alterar grupos de produtos comercializados no site.
| F03	| Adicionar, remover ou alterar fabricante de produtos.	| O administrador tem à sua disponibilidade a função de adicionar, remover ou alterar fabricantes de produtos comercializados no site.
| F04	| Disponibilizar ou bloquear a apresentação do produto no site de venda	| O administrador tem à sua disponibilidade a função de liberar ou bloquear a apresentação de produtos a venda 
| F05	| Consultar pedidos realizados e não enviados.	| O administrador pode acessar os dados de vendas de produtos do site que foram realizados pelos clientes e que ainda não foram remetidos
| F06	| Registrar recebimento do pagamento do cliente	| O administrador registra no site a identificação do recebimento do pagamento realizado pelo cliente liberando o pedido para envio.
| F07	| Registrar o envio do pedido.	| O administrador informa no site a forma de envio do pedido ao cliente.
| F08	| Visualizar produtos	| O usuário visualiza os produtos disponíveis filtrando ou por grupos, fabricante ou através de um trecho do nome do produto
| F09	| Adicionar ou remover produtos à cesta de compras	| O usuário  pode escolher mais de um produto para realizar a compra e inserir em uma cesta de compras.
| F10	| Realizar o cadastro e login no site	| O usuário pode se cadastrar no site para poder comprar produtos e acessar outras diversas funcionalidades como avaliar e comentar os produtos.
| F11	| Realizar a compra de um produto	| Os clientes podem confirmar a compra dos produtos adicionados em sua cesta de compra gerando assim um pedido.
| F12	| Realizar o cancelamento de pedido solicitado	| Os clientes podem solicitar o cancelamento de um pedido realizado desde que ainda não tenha sido enviado.
| F13	| Verificar as compras realizadas	| Os clientes podem verificar seu histórico de compra na loja.
| F14	| Verificar o andamento do pedido	| Os clientes podem acompanhar o andamento da entrega dos pedidos realizados.
| F15	| Avaliar o Produto	| Os clientes podem avaliar os produtos realizando um comentário e atribuindo uma nota
| F16 	| Revisar dados cadastrais	| Os clientes podem alterar seus dados cadastrais permitindo assim que façam, por exemplo, alteração do endereço de entrega
| | | | 
## 9.	Requisitos não-funcionais
| Código | Nome | Descrição | Categoria | Classificação |
|:---  |:--- |:--- |:--- |:--- |
| NF01	| Design responsivo	| O site apresentará responsividade, deixando-o mais confortável para o usuário | Usabilidade	| obrigatório
| NF02	| Acesso somente com internet	| É necessário um acesso contínuo à Internet para poder acessar os dados do site e suas funcionalidades, como comprar produtos.	| Disponibilidade	| Obrigatório
| NF03	| Criptografia das informações sensíveis aos usuários	| Senhas do usuário devem ser gravadas de forma criptografada no banco de dados	| Segurança	| Obrigatório
| NF04	| Organização do conteúdo de forma objetiva	| O site apresentará o conteúdo de forma objetiva, de modo que o usuário encontre o desejado com facilidade.	| Usabilidade	| Obrigatório
| | | | 
