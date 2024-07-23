# Documento de visão

### Histórico da Revisão 
|  Data  | Versão | Descrição | Autor |
|:-------|:-------|:----------|:------|
| 11/03/2024 | **1.10** | Adição de requisitos  | Os Entregadores |
| 10/07/2024 | **2.00** | Redirecionamento do documento de visão  | Os Entregadores |

## 1. Objetivo do Projeto 
**Projeto**: Plataforma de venda de livros (eLibros)

## 2. Descrição do problema 
| | |
|:-|:-|
| **_O problema_**    | Falta de distribuição, divulgação e venda de livros nacionais no país  |
| **_afetando_**      | Consumidores dessas mídias (Leitores) |
| **_cujo impacto é_**| Falta de acesso e divulgação da literatura nacional |
| **_uma boa solução seria_** | Criação de uma plataforma (site) que oferta e divulga livros nacionais |


## 3. Descrição dos usuários
| Nome | Descrição | Responsabilidades |
|:- |:- |:- |
| Administrador  | Gestor da Loja; Usuário responsável pelos processos que permitem que os clientes adquiram os produtos com uso no site de vendas e acompanhem o processo de entrega dos pedidos realizados | Cadastrar os produtos e seus preços de venda; Disponibilizar ou bloquear a apresentação do produto no site de venda; Verificar as vendas realizados no período que ainda não foram remetidas aos clientes; Registra informações de envio dos pedidos aos clientes; Registra informação de controle de pagamento de pedidos|
| Visitante   | Usuário que visualiza o site; O usuário deve ter a possibilidade de obter informações acerca dos produtos vendidos e seus preços, sem a necessidade de registrar suas informações cadastrais no site | O usuário deve poder consultar os produtos por várias opções de  busca de forma a facilitar que ele encontre os produtos desejados; Deverá ser possível também montar uma cesta de compras com os itens que deseja adquirir; Caso deseje, poderá criar um registro de usuário com senha de forma a possibilitar o acesso a área de realização de pedidos de produtos e acompanhamento de entrega |
| Cliente | Usuário cadastrado; O usuário, após realizar seu cadastro no site, poderá realizar compras | Após a realização a inclusão de dados cadastrais tais como login, senha e endereço, o usuário (anteriormente do tipo Visitante) passa a ser visto como cliente e poderá registrar seus pedidos. Os pedidos poderão ser compostos por um ou mais produtos e deverão incluir suas respectivas quantidades adquiridas. O valor total do pedido deve ser apresentado. O cliente deve ter acesso às seguintes funcionalidades no site: Alterar seus dados cadastrais; Visualizar seu histórico de pedidos e observar a situação destes; Visualizar a situação de entrega dos pedidos; Cancelar o pedido; Avaliar os produtos adquiridos|
## 4. Descrição do ambiente dos usuários 
O comércio eletrônico tem três tipos de usuários. O tipo Administrador representa o gestor do site, o tipo Visitante representa o usuário não cadastrado que deseja visitar o site e o tipo Cliente representa um usuário já cadastrado. 
O administrador acessará o site a partir da sede da loja, fará a configuração dos produtos a serem vendidos e realizará a logística de atendimento dos pedidos coletados pelo site, registrando a informação de situação de envio dos pedidos. Nesse processo, os produtos que forem identificados fisicamente sem estoque deverão ter sua disponibilidade para venda bloqueada.
Os usuários Visitante e Cliente irão acessar o site utilizando  um computador ou celular, realizará a visualização dos produtos vendidos na loja e, caso deseje e esteja cadastrado, realizará a compra. Neste caso não há muitas restrições quanto ao ambiente pois ele poderá fazer os pedidos de qualquer local que tenha conexão com internet.
## 5. Principais necessidades dos usuários
Considerando o pronto de vista do administrador do site, sua principal necessidade é gerenciar seu funcionamento, controlando o leque de produtos, a visibilidade do processo de entrega, suas configurações, entre outros. 
Considerando o pronto de vista do cliente, ele deseja ter acesso a um site com interface amigável que permita obter informações sobre os produtos comercializados e, caso identifique que estes atendam às suas necessidades, ele possa montar sua relação de compra confirmando a aquisição. Após essa etapa ele desejará visualizar o processo de entrega dos produtos adquiridos.
## 6. Alternativas concorrentes

**Saraiva**

  Pontos fortes: ---
  
  Pontos fracos: além de algumas características superficiais observadas, como subcategorias extremamente mal formatadas, o site é completamente inutilizável; absolutamente todos os links e botões do website estão quebrados mesmo sendo possível observar os livros.

**Livraria Leitura**

  Pontos fortes: eles entregam o propósito do sistema. As subcategorias são diversas e bem organizadas, tornando a navegação agradável e intuitiva.
  
  Pontos fracos: não atende as expectativas de um website de livros bem organizado (a organização é muito extendida horizontalmente e assim apresenta pouca informação simultaneamente).
  
**Livraria Cultura**

  Pontos fortes: visualmente o site parece agradável por ter definido largura nos itens da página inicial, mas não há elogios além disso.
  
  Pontos fracos: além da péssima diagramação da aba de categorias, seu conteúdo semântico também deixa muito a desejar. As subcategorias são arranjadas de forma contraditória: algumas são extremamente específicas enquanto outras são extremamente abrangentes; o mesmo nicho se encontra em subcategorias diferentes e, a princípio, nem deveria estar em mais de uma. Ao tentar comprar um livro, o usuário se depara com uma tela extremamente mal formatada. O design é brusco e possui vários itens inúteis: um botão que te leva a descrição mesmo esta já estando na tela e um retângulo cinza aleatório no meio da tela que não incentiva nada nem enfatiza nada além de a si mesmo.

**Loja Panini**

  Pontos fortes: um website que realmente entrega seu conteúdo no quesito "quadrinhos". A aba de comprar um livro é realmente bem feita, a descrição do livro e sua aba de ver o volume anterior ajudam muito na compra. As categorias e subcategorais são bem divididas e tornam a navegação bastante intuitiva.
  
  Pontos fracos: ---


## 7.	Visão geral do produto
Esse projeto consiste em um site voltado para vendas de livros que pretende funcionar de forma rápida e eficiente, disponibilizando um ambiente acessível a diversos tipos de usuários e possuindo um design confortável. Para tal, o site irá disponibilizar diferentes mecanismos de busca permitindo que o usuário encontre de forma eficiente o que ele precisa. Após a aquisição, o usuário poderá acompanhar o produto comprado, avaliar produtos da loja, avaliar e marcar produtos como favoritos. 
## 8.	Requisitos funcionais
| Código | Nome | Descrição |
|:---  |:--- |:--- |
| F01	| Adicionar, remover ou alterar produtos | O administrador tem à sua disponibilidade a função de adicionar, remover ou alterar produtos comercializados no site estabelecendo ainda seus preços de venda. 
| F02	| Disponibilizar ou bloquear a apresentação do produto no site de venda	| O administrador tem à sua disponibilidade a função de liberar ou bloquear a apresentação de produtos a venda 
| F03	| Consultar pedidos realizados e não enviados.	| O administrador pode acessar os dados de vendas de produtos do site que foram realizados pelos clientes e que ainda não foram remetidos
| F04	| Registrar recebimento do pagamento do cliente	| O administrador registra no site a identificação do recebimento do pagamento realizado pelo cliente liberando o pedido para envio.
| F05	| Registrar o envio do pedido.	| O administrador informa no site a forma de envio do pedido ao cliente.
| F06	| Visualizar produtos	| O usuário visualiza os produtos disponíveis, podendo filtrá-los.
| F07	| Adicionar ou remover produtos à cesta de compras	| O usuário  pode escolher mais de um produto para realizar a compra e inserir em uma cesta de compras.
| F08	| Realizar o cadastro e login no site	| O usuário pode se cadastrar no site para poder comprar produtos e acessar outras diversas funcionalidades como avaliar e comentar os produtos.
| F09	| Realizar a compra de um produto	| Os clientes podem confirmar a compra dos produtos adicionados em sua cesta de compra gerando assim um pedido.
| F10	| Realizar o cancelamento de pedido solicitado	| Os clientes podem solicitar o cancelamento de um pedido realizado desde que ainda não tenha sido enviado.
| F11	| Verificar as compras realizadas	| Os clientes podem verificar seu histórico de compra na loja.
| F12	| Verificar o andamento do pedido	| Os clientes podem acompanhar o andamento da entrega dos pedidos realizados.
| F13 | Revisar dados cadastrais	| Os clientes podem alterar seus dados cadastrais permitindo assim que façam, por exemplo, alteração do endereço de entrega

## 9.	Requisitos não-funcionais
| Código | Nome | Descrição | Categoria | Classificação |
|:---  |:--- |:--- |:--- |:--- |
| NF01	| Design responsivo	| O site apresentará responsividade, deixando-o mais confortável para o usuário | Usabilidade	| obrigatório
| NF02	| Acesso somente com internet	| É necessário um acesso contínuo à Internet para poder acessar os dados do site e suas funcionalidades, como comprar produtos.	| Disponibilidade	| Obrigatório
| NF03	| Criptografia de informações sensíveis aos usuários	| Senhas do usuário devem ser gravadas de forma criptografada no banco de dados	| Segurança	| Obrigatório
| NF04	| Organização do conteúdo de forma objetiva	| O site apresentará o conteúdo de forma objetiva, de modo que o usuário encontre o desejado com facilidade.	| Usabilidade	| Obrigatório

