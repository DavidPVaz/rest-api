## Project Description

- Simple RESTful API built with Express. Data persisted in a PostgreSQL database
- To replicate:
    1. generate your own tls credentials and store them in `config/tls`
    2. set your own environment variables in a `.env` file in root dir. 3 variables are used in this project: PORT, NODE_ENV, DB_URI

## Layered architecture for proper separation of concerns

### Controllers

- Send the result back to the client

### Service Layer

- Perform work for the Controller
- Return the result for the Controller

### Data Access Layer

- Dao pattern for data entity
- ORM with transactional capabilities

### Express Router

- Map routes to middleware and handler

## Features

- HTTPS
- Stateless authentication for API endpoints (JWT)
- Simple authorization
- Request validation (Joi)
- Password hashing (bcrypt)
- Database ORM (Objection) with migrations (Knex)
- Usage of native Promises
- ES6

#### Reset the database to it's original state

`npm run dbschema`
