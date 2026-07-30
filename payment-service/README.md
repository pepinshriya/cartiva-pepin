# Payment Service

Microservice for processing payments and managing transactions.

## Tech Stack

- Node.js / Express.js
- AWS DynamoDB (SDK v3)

## Setup

```bash
cd payment-service
npm install
cp .env .env.local  # update credentials
npm run dev
```

## Environment Variables

| Variable                | Description                             |
| ----------------------- | --------------------------------------- |
| `AWS_REGION`            | AWS region (default: us-east-1)         |
| `AWS_ACCESS_KEY_ID`     | AWS access key                          |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                          |
| `TABLE_NAME`            | DynamoDB table name (default: Payments) |
| `PORT`                  | Server port (default: 3005)             |

## API Endpoints

| Method | Path                              | Description           |
| ------ | --------------------------------- | --------------------- |
| POST   | `/api/payments`                   | Create a new payment  |
| GET    | `/api/payments/:paymentId`        | Get payment by ID     |
| PUT    | `/api/payments/:paymentId/refund` | Refund a payment      |
| PUT    | `/api/payments/:paymentId/status` | Update payment status |

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
