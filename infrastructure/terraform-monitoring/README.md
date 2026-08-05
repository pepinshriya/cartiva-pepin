# Ecommerce Monitoring Infrastructure

This Terraform project manages the monitoring resources (CloudWatch Dashboards, Alarms) for the Ecommerce microservices.

**IMPORTANT:** This project strictly handles _monitoring_. It does not manage, modify, or delete any of the core application resources (Lambdas, APIs, DynamoDB tables). It uses Terraform `data` sources to reference the existing infrastructure.

## Configuration

The state file for this project is stored independently in an S3 bucket (`ecommerce-terraform-state-726101441380`) to isolate it from application state.

Variables and alarm thresholds can be configured in `terraform.tfvars`.
