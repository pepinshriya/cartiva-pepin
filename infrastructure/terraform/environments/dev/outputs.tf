output "api_gateway_url" {
  description = "API Gateway invoke URL"
  value       = module.api_gateway.invoke_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.this.id
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.this.arn
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = aws_cognito_user_pool_client.this.id
}

output "dynamodb_cart_table" {
  description = "Cart DynamoDB table name"
  value       = module.dynamodb_cart.name
}

output "sns_order_events_arn" {
  description = "Order events SNS topic ARN"
  value       = module.sns_order_events.arn
}

output "sns_payment_events_arn" {
  description = "Payment events SNS topic ARN"
  value       = module.sns_payment_events.arn
}

output "lambda_function_names" {
  description = "Map of Lambda function names"
  value = {
    auth         = module.lambda_auth.function_name
    product      = module.lambda_product.function_name
    order        = module.lambda_order.function_name
    cart         = module.lambda_cart.function_name
    payment      = module.lambda_payment.function_name
    notification = module.lambda_notification.function_name
    frontend     = module.lambda_frontend.function_name
  }
}
