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

output "alias_arn" {
  description = "Lambda alias ARN (null when no alias is configured)"
  value       = var.alias_name != null ? aws_lambda_alias.this[0].arn : null
}

output "alias_invoke_arn" {
  description = "Lambda alias invoke ARN for API Gateway integration (null when no alias is configured)"
  value       = var.alias_name != null ? aws_lambda_alias.this[0].arn : null
}
