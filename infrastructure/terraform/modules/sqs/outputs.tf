output "arn" {
  description = "SQS queue ARN"
  value       = aws_sqs_queue.this.arn
}

output "url" {
  description = "SQS queue URL"
  value       = aws_sqs_queue.this.id
}

output "name" {
  description = "SQS queue name"
  value       = aws_sqs_queue.this.name
}
