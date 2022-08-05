## Project Description

-   Monolithic RESTful API originally built with Express, but migrated to Hapi. Data persisted in a PostgreSQL database. Currently it only has an authorization module that implements RBAC mechanism.

## Layered architecture for proper separation of concerns

### Controllers

-   Send the result back to the client.

### Service Layer

-   Perform work for the Controller.
-   Return the result for the Controller.

### Data Access Layer

-   Repository pattern for data entity.
-   ORM with transactional capabilities.

## Features

-   HTTPS.
-   API documentation.
-   Stateless authentication for API endpoints.
-   Reactive nodemailer.
-   Database ORM with migrations and seeds.
-   CSV seeds management system.

#### Start the server

`npm run start`/`npm run watch`

#### Reset the database to it's original state

`npm run reset`

#### Run tests

`npm run test`

#### Run a specific test

`npm run test:grep <target test desctiption>`

#### Generate an hashed string

`npm run hash <string>`

#### Generate a secret

`npm run secret`

#### Generate JWT token for a specific user

`npm run token <userId>`
