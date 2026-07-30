output "log_group_names" {
  description = "Map of Lambda function names to log group names"
  value = {
    for k, v in aws_cloudwatch_log_group.lambda : k => v.name
  }
}

output "alarm_names" {
  description = "List of created CloudWatch alarm names"
  value = concat(
    [for a in aws_cloudwatch_metric_alarm.lambda_errors : a.alarm_name],
    [for a in aws_cloudwatch_metric_alarm.lambda_throttles : a.alarm_name],
    [for a in aws_cloudwatch_metric_alarm.api_gateway_5xx : a.alarm_name],
  )
}
