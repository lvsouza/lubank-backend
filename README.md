
<h1 style="font-size:50px" align="center">Lubank</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/lvsouza/lubank-backend/master/docs/logo-lubank.png" height="320" alt="Logo lubank" />
</p>


## De onde veio a ideia
A ideia do projeto veio através de um desafio. Os requisitos inicias que deram origem a todo este conteúdo pode ser encontrado aqui neste [link](https://docs.google.com/document/d/109Des7J2tU1Gk_Tg8gwvgAsSm2hm1abN8XNAydOZVts/edit?usp=sharing). Os nomes e os logo tipos forande desenvolvidos apenas para dar uma identidade extra ao projeto.


## Sobre o desenvolvimento
Para ser possível a conslusão deste projeto foram utilizados algums outros recursos disponíveis aqui mesmo no github e no figma.

1. [Link](https://github.com/lvsouza/lubank-backend/projects/1) **Quadro de acompanhamento do projeto** - Assim como em diversos time de desenvolvimento, foi utilizado um board para acompanhar o progresso do desenvolvimento da aplicação.

2. [Link](https://github.com/lvsouza/lubank-backend/issues?q=is%3Aissue+is%3Aclosed) **Issues para quebra de problemas** - De fato esta aplicação não nenhum pouco pequena, para auxiliar minha organização utilizei as issues. Cada issue cadastrada representa uma parte do processo de desenvolvimento.

3. [Link](https://www.figma.com/file/bfGY4OUuswbhz7DMn1Y6Mr/Lubank?node-id=0%3A1) **Protótipo no figma** - É fato que nos conseguimos visualizar muito melhor o que precisamos fazer se tiver em mão um protótipo do resultado final esperado. Tendo isso em mente, também foi desenvolvido por mim([Lucas Souza](https://github.com/lvsouza)) um protótipo, apenas uma ideia de interface pra a aplicação. Utilizo apenas para uma melhor organização do pensamento, mas não algo estremamento importante.


## Descrição

Sistema de controle de conta corrente bancária, processando solicitações de depósito, resgates e pagamentos. 

## A aplicação

- **Principais funcionalidades**
  - Autenticação - Permite que um usuário que já tenha uma conta cadastrada faça login e veja sua conta
  - Cadastro - Permite que um pessoa possa criar uma conta dentro da aplicação e tenha uma conta remunerada
  - Extrato / histórico da conta (entradas e saídas) - Permite que seja consultado o extrato completo da conta
  - Realizar um depósito - Possibilita que seja feito um depósito na conta do usuário logado
  - Realizar um resgate - Permite realizar uma transferência para outra conta qualquer
  - Fazer um pagamento - Permite pagar boletos que foram cadastrados previamente na base
  - Consulta de saldo - Consulta o saldo em conta, e o atualiza com o calculo de juros


## As tecnologias utilizadas
- TypeScript
- Express
- Knex
- SQlite
- Jest
- Node

## Por que de cada tecnologia?
- **Node** - Bom, node basicamente é o que me permite escolher as outras tecnologias, exceto pelo SQLite.
- **TypeScript** - Escolhi o typescript porque tende a facilitar o desenvolvimento para a maioria dos projetos, ajuda a evitar bugs e deixa o código mais limpo(se utilizado da maneira correta), além de ser possível definir tipagens para praticamente tudo. A logo e a médio prazo ou para times de qualquer tamanho a escolha do TS vai trazer maior desempenho no desenvolvimento. e mais facilidade na padronização do desenvolvimento.
- **Jest** - O Jest foi escolhido por que se integra muito bem com o typescript e com o Knex, além do mais ele é muito siples de se utilizar e tem uma boa documentação.
- **Express** - Esta foi minha escolha porque o express é muito simples de ser utilizado, tem uma boa documentação na internet e se integra muito bem com todas as tecnologias que optei.
- **Knex** - O Knex é minha escolha para o projeto porque ele agiliza demais o desenvolvimento em geral, se integra muito bem o typescript e me permite acessar muito mais rápido diverso recursos úteis do banco de dados. E outro ponto decisivo nessa escolha é a integração com diversos bancos de dados como o `postgress`, `SQLServer`, `MySql` e principalmente com o `SQLite`. Vale destacar que para alterar de banco de dados na maioria das vezes é apenas alterar a string de conexão.
- **SQLite** - As principais razões dessa escolha foram a praticidade na utilização, a integração com o Knex, por ser leve, ser relacional e ainda ser rodado em memória no `beforeAll` do Jest. Tendo em vista que este projeto não será utílidado em produção essa pode ser uma escolha.

## Organização do projeto
```YAML
lubank-backend
  docs
  src
    controllers
      ...
      ...
    database
      migrations
        ...
        ...
      provider
        ...
        ...
      seeds
        ...
        ...
      connection.ts
      MigrationHelp.ts
      TableNames.ts
      TransactionTypes.ts
    services
      auth
        ...
        ...
      helper
        ...
        ...
    routes.ts
    server.ts
  .env
  .gitignore
  knexfile.js
  packaje.json
  jest.config.js
  README.md
  tsconfig.json
```

- **lubank-backend** - Base do projeto.
  - **docs** - Onde deve fica coisas que documentam o projeto como arquivos .MD, imagens e etc.
  - **src** - Pasta base do desenvolvimento, todas as implementações de recursos do projeto devem ficar aqui.
    - **controllers** - onde fica os arquivos que são usados diretamente pelas rotas da aplicação.
    - **database** - Fica toda a configuração do banco de dados como arquivos e migração, seeds e os principais metodos de acesso a base.
      - **migrations** - Onde fica os aquivo que junto com o knex permitem criar as tabelas da base de dados ou até excluí-las se necessário.
      - **provider** - Fica a definição dos metodos utilizados para escrever e ler os dados da base, este metodos são utilizados diretamente pelas controllers.
      - **seeds** - Assim como as migrations, é a definição que arquivos utlizados pelo knex. Nesse caso os seeds apenas criam alguns registros na base caso necessário.
      - **connection.ts** - Cria a conexão da base com o knex.
      - **MigrationHelp.ts** - Fornece com alguns utilitários para as migrações.
      - **TableNames.ts** - Enumerador com o nome das tabelas, ajuda a evitar erros de nomenclatura da hora de usar uma tabela.
      - **TransactionTypes.ts** - Enumerador com os tipos de transações que podem ser feitas, ajuda no desenvolvimento.
    - **services** - Fornece para a aplicação diverças ferramentas que auxiliam o desenvolvimento.
      - **auth** - Contém o encode e decode de token jwt e criptografia de senhas.
      - **helper** - Algumas outras ferramentas úteils como: diffDate, formateDate, randomNumbers e responseHandler.
    - **routes.ts** - Contém as definições de rotas das aplicações .
    - **server.ts** - Contém a o startup do servidor.
  - **.env** - Variáveis de ambiente.
  - **.gitignore** - Arquivos e pastas ignoradas pelo git.
  - **.knexfile.js** - configurações do knex.
  - **.packaje.json** - Configurações do projeto como um todo.
  - **.README.md** - Documentação básica da aplicação.
  - **.tsconfig.json** - Configurações do typescript.


## As principais abordagem

1. **Estratégia de autenticação** - 
 Para a realizar o login na aplicação o usuário préviamente deve ter uma conta registrada. Utilizando seu email e senha ele poderá realizar a autenticação através do servidor. O servidor ao receber uma chamada para sua rota de autenticação devolve uma token `JWT` de acesso. Apartir deste momento todas as chamadas devem informar no header o `authorization` para proceguir. Esta é uma abordagem comum em conexões entre o servidor e a aplicação cliente. 

2.  **Calculo do rendimento** - O calculo dos rendimento do usuário nessa aplicação é feita no momento da consulta do seu saldo ou logo antes de algum tipo de transação ser feita. Isso é assim por que o SQLite não possui uma forma muito segura de fazê-la. Embora não parece, mas pode ser uma abordagem muito interressante.

3. **KNEX - SQL query builder** - Estou utilizando este meio para realizar as consultas na base porque o knex torna os selects, updates e deletes muito mais parecidos com o javascript, o que facilita o endendimento e a manutenção, ainda utilizando typescript os autocompletes são de grande ajuda tanto para agilizar o desenvolvimento quando para deixá-lo mais prazeroso.

4. **`Celebrate`** - O `celebrate` é uma lib de validações de entrada, usamos ela no projeto para facilitar a validação dos campos que esperamos como parâmetro em algumas rotas.

5. **`Provider`, `testes`, `controller` e `rota`** - Na verdade estas três abordagem estão muito ligadas, explicação: 

      * `Provider` - Este é na verdade apenas um conceito que nesse caso estou usando para me dirigir a um metodo de uma classe. A questão é que este metodo fará acesso a base de dados em algum momento, realizando alguma consulta ou escrevendo alguma coisa nas tabelas.
      * `Testes` - Os testes vão utilizar os metodos providers para testar algum tipo de operação na base de dados para fazer uma validação direta se o metodos em questão está fazendo aquilo que foi projetado para fazer.
      * `Controller` - Assim como o provider, este é apenas um nome para um determinado tipo de metodo. Nesse caso os metodos serão a porta de entrada da requisição. Os metodos farão a interação básica com a requisição, depois devem redirecionar algum tipo de solicitação para os metodos providers. Ao final, a controller devolve uma response contendo algum tipo de erro ou algum tipo de sucesso.
      * `Rota` - Está e a camada mais esterna, nela é definido os metodos utilizados e as urls.


## Executando a aplicação
```BASH
git clone https://github.com/lvsouza/lubank-backend.git
cd ./lubank-backend/
yarn
yarn knex:migrate
yarn start
```
Interaja com a aplicação em `http://localhost:3333/`


## License
MIT @ [Lucas Souza](https://github.com/lvsouza)
