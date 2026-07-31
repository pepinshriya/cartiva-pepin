# Terraform - E-Commerce Microservices Infrastructure

## Prerequisites

- Terraform >= 1.5
- AWS credentials configured (environment variables, `~/.aws/credentials`, or IAM role)
- Backend S3 bucket created manually:

```powershell
aws s3 mb s3://ecommerce-terraform-state-726101441380 --region ap-southeast-1
```

> **Note:** DynamoDB state locking is intentionally disabled. The AWS Academy account has an
> Organization SCP that explicitly denies `dynamodb:CreateTable`, so the lock table
> `ecommerce-terraform-state-lock` cannot be created and the S3 backend runs without
> `dynamodb_table`.

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
