# E-Commerce Microservices

A fully working local e-commerce backend built with **microservice architecture** using **Node.js**, **Express.js**, and **AWS DynamoDB**.

## Architecture

Each microservice runs independently on its own port with its own Express server, database table, and codebase.

```
Client  →  Product Service (3001)
         →  Inventory Service (3002)
         →  Cart Service (3003)
         →  Order Service (3004)
         →  Payment Service (3005)
```

## Services

| Service | Port | Description |
|---|---|---|
| **product-service** | 3001 | Product catalog CRUD |
| **inventory-service** | 3002 | Stock level management |
| **cart-service** | 3003 | Shopping cart operations |
| **order-service** | 3004 | Order lifecycle |
| **payment-service** | 3005 | Payment processing |

## Getting Started

```bash
# Install dependencies for a service
cd product-service
npm install

# Start in development mode
npm run dev

# Or start in production mode
npm start
```

Each service has its own `.env` file with configuration.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Amazon DynamoDB (AWS SDK v3)
- **Packages:** cors, dotenv, uuid, nodemon

## Service Structure

Every service follows the same pattern:

```
service-name/
├── src/
│   ├── config/         DynamoDB client setup
│   ├── controllers/    HTTP request handlers
│   ├── middleware/      Error handling middleware
│   ├── models/         Table schema and constants
│   ├── repositories/   Database operations
│   ├── routes/         Express route definitions
│   ├── services/       Business logic layer
│   ├── utils/          Response helpers and validators
│   ├── app.js          Express application setup
│   └── server.js       Entry point with listener
├── package.json
├── .env
└── README.md
```

## Prerequisites

- Node.js 18+
- AWS account with DynamoDB tables created
- AWS credentials configured via environment variables or ~/.aws/credentials
