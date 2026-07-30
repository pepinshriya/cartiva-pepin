# Terraform - E-Commerce Microservices Infrastructure

## Prerequisites

- Terraform >= 1.5
- AWS credentials configured (environment variables, `~/.aws/credentials`, or IAM role)
- Backend S3 bucket and DynamoDB lock table created manually:

```powershell
aws s3 mb s3://ecommerce-terraform-state --region ap-southeast-1
aws dynamodb create-table `
    --table-name ecommerce-terraform-state-lock `
    --attribute-definitions AttributeName=LockID,AttributeType=S `
    --key-schema AttributeName=LockID,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --region ap-southeast-1
```

## Module Structure

| Module        | Description                                  |
| ------------- | -------------------------------------------- |
| `iam`         | Lambda IAM roles with granular policies      |
| `lambda`      | Lambda functions (zip or S3 deployment)      |
| `dynamodb`    | DynamoDB tables with GSIs and encryption     |
| `sns`         | SNS topics for event-driven communication    |
| `sqs`         | SQS queues (defined but not instantiated)    |
| `api-gateway` | HTTP API with ANY proxy + Lambda integration |
| `cloudwatch`  | Log groups, metric alarms, dashboards        |

## Environments

### Dev

```
cd environments/dev
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

7 Lambda functions (auth, product, order, cart, payment, notification, frontend), Cognito User Pool, Cart DynamoDB (PAY_PER_REQUEST), SNS topics for order/payment events, API Gateway, CloudWatch dashboard.

### Prod

```
cd environments/prod
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

Same services as dev plus: Products & Orders DynamoDB tables (PROVISIONED), point-in-time recovery, Cognito client secret, longer log retention (90 days), stricter alarms.
