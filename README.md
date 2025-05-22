# crud-news

API para gerenciamento de notícias usando NestJS, TypeORM e PostgreSQL. Desenvolvido de acordo com o desafio proposto.

## Tecnologias

- Node.js
- NestJS
- TypeORM
- PostgreSQL
- Docker
- Swagger

## Pré-requisitos

- Node.js >= 16
- Docker
- Git

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd crud-news
```

### 2. Instale as dependências

```bash
yarn install ou npm install
```

### 3. Crie e configure o arquivo .env com as credenciais do banco

```bash
cp .env.example .env
```

### 4. Inicie o projeto no Docker 

```bash
docker-compose up --build
```

### 5. Testes e documentação

Execute os testes unitário utilizando

```bash
yarn run test
```

[Acesse a documentação do Swagger através deste link](http://localhost:3000/api)
