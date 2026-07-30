# Inventory Service

Microservice for managing stock levels and inventory.

## Tech Stack

- Node.js / Express.js
- AWS DynamoDB (SDK v3)

## Setup

```bash
cd inventory-service
npm install
cp .env .env.local  # update credentials
npm run dev
```

## Environment Variables

| Variable                | Description                              |
| ----------------------- | ---------------------------------------- |
| `AWS_REGION`            | AWS region (default: us-east-1)          |
| `AWS_ACCESS_KEY_ID`     | AWS access key                           |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                           |
| `TABLE_NAME`            | DynamoDB table name (default: Inventory) |
| `PORT`                  | Server port (default: 3002)              |

## API Endpoints

| Method | Path                                 | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | `/api/inventory`                     | Add stock for a product |
| GET    | `/api/inventory/:productId`          | Get stock by product ID |
| PUT    | `/api/inventory/:productId`          | Update stock quantity   |
| PATCH  | `/api/inventory/:productId/reduce`   | Reduce stock            |
| PATCH  | `/api/inventory/:productId/increase` | Increase stock          |

## Project Structure

```
src/
├── config/         DynamoDB client
├── controllers/    Request handlers
├── middleware/     Error handling
├── models/         Table schema / constants
├── repositories/   Database operations
├── routes/         Express route definitions
├── services/       Business logic
├── utils/          Helpers (validation, response)
├── app.js          Express app setup
└── server.js       Entry point
```
