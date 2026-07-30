output "function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.this.arn
}

output "function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.this.function_name
}

output "invoke_arn" {
  description = "Lambda invoke ARN (for API Gateway integration)"
  value       = aws_lambda_function.this.invoke_arn
}

output "qualified_arn" {
  description = "Latest qualified function ARN"
  value       = aws_lambda_function.this.qualified_arn
}
