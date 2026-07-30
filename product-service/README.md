# Product Service

Microservice for managing product catalog.

## Tech Stack

- Node.js / Express.js
- AWS DynamoDB (SDK v3)

## Setup

```bash
cd product-service
npm install
cp .env .env.local  # update credentials
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `AWS_REGION` | AWS region (default: us-east-1) |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `TABLE_NAME` | DynamoDB table name (default: Products) |
| `PORT` | Server port (default: 3001) |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/products` | Create a product |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

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
