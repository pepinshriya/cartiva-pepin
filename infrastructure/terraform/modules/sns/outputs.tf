output "arn" {
  description = "SNS topic ARN"
  value       = aws_sns_topic.this.arn
}

output "name" {
  description = "SNS topic name"
  value       = aws_sns_topic.this.name
}
