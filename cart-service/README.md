# Cart Service

Microservice for managing shopping carts.

## Tech Stack

- Node.js / Express.js
- AWS DynamoDB (SDK v3)

## Setup

```bash
cd cart-service
npm install
cp .env .env.local  # update credentials
npm run dev
```

## Environment Variables

| Variable                | Description                         |
| ----------------------- | ----------------------------------- |
| `AWS_REGION`            | AWS region (default: us-east-1)     |
| `AWS_ACCESS_KEY_ID`     | AWS access key                      |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                      |
| `TABLE_NAME`            | DynamoDB table name (default: Cart) |
| `PORT`                  | Server port (default: 3003)         |

## API Endpoints

| Method | Path                                 | Description           |
| ------ | ------------------------------------ | --------------------- |
| POST   | `/api/cart`                          | Create a new cart     |
| GET    | `/api/cart/:userId`                  | View cart by user ID  |
| POST   | `/api/cart/:userId/items`            | Add item to cart      |
| DELETE | `/api/cart/:userId/items/:productId` | Remove item from cart |
| DELETE | `/api/cart/:userId`                  | Clear cart            |

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
