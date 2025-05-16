# Absence App REST API

## Table of Content
- [Preparation](#preparation)
- [Run Server](#run-server)
- [Feature](#feature)
- [Project Structure](#project-structure)
- [Response Format](#response-format)

## Preparation
- Fill and copy your environtment file in development or production to .env or change default import from environtment file
- Instal dependencies
```
npm install
```
- Generate prisma client
```
npm run prisma:generate
```
- Migrate database
```
npm run migrate 
```
- Seed database
```
npm run seed
```

## Run Server
- Start the server in local development
```
npm run dev
```
- Start the server in production
```
npm run start
```

## Run Server in Docker
- Start the server
```
docker compose up --build
```
- Stop the server
```
docker compose down
```

## Feature
- **Database**: using https://www.postgresql.org/
- **ORM**: using https://prisma.io/
- **Authentication**: using https://github.com/auth0/node-jsonwebtoken and https://github.com/passportjs/passport
- **Logging**: using https://github.com/expressjs/morgan and https://github.com/winstonjs/winston
- **Linting**: using https://eslint.org/
- **Validation**: https://express-validator.github.io/docs/
- **Rate Limit**: using https://github.com/expressjs/express-rate-limit
- **Security**: using https://helmetjs.github.io/
- **CORS**: using https://github.com/expressjs/cors
- **Compression**: using https://github.com/expressjs/compression
- **Environtment variables**: using https://github.com/motdotla/dotenv
- **API Documentation**: using https://swagger.io/
- **Dependency management**: using https://www.npmjs.com/

## Project Structure
```
docs\               # Documentation files
prisma\             # Database configuration
src\
  |--config\        # Config files
  |--controllers\   # Request handler
  |--helpers\       # Utility function
  |--middlewares\   # Middleware
  |--repositories\  # Database queries
  |--routes\        # API routes
  |--types\         # Typescript types
  |--utils\         # Utility function
  |--validators\    # Validation function
  |--app.ts         # Main app entry point
  |--index.ts       # Main entry point
```

## Response Format

- **Success Response**:
```
{
  "statusCode": 200,
  "message": "success message",
  "data": {
    "key": "value",
  }
}
```
- **Error Response**:
```
{
  "statusCode": 400,
  "message": "error message",
}