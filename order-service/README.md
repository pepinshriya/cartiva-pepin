# Order Service

Microservice for managing order lifecycle.

## Tech Stack

- Node.js / Express.js
- AWS DynamoDB (SDK v3)

## Setup

```bash
cd order-service
npm install
cp .env .env.local  # update credentials
npm run dev
```

## Environment Variables

| Variable                | Description                           |
| ----------------------- | ------------------------------------- |
| `AWS_REGION`            | AWS region (default: us-east-1)       |
| `AWS_ACCESS_KEY_ID`     | AWS access key                        |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                        |
| `TABLE_NAME`            | DynamoDB table name (default: Orders) |
| `PORT`                  | Server port (default: 3004)           |

## API Endpoints

| Method | Path                          | Description               |
| ------ | ----------------------------- | ------------------------- |
| POST   | `/api/orders`                 | Place a new order         |
| GET    | `/api/orders/:orderId`        | Get order by ID           |
| GET    | `/api/orders/user/:userId`    | Get all orders for a user |
| PUT    | `/api/orders/:orderId/cancel` | Cancel an order           |

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
