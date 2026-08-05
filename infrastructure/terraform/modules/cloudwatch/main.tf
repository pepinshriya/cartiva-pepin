resource "aws_cloudwatch_log_group" "lambda" {
  for_each = toset(var.lambda_function_names)

  name              = "/aws/lambda/${each.value}"
  retention_in_days = var.log_retention_days
  tags              = var.tags

  lifecycle {
    ignore_changes = [tags_all]
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  for_each = toset(var.lambda_function_names)

  alarm_name          = "${each.value}-ErrorAlarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = var.alarm_period_seconds
  statistic           = "Sum"
  threshold           = var.error_alarm_threshold
  alarm_description   = "Alarm when ${each.value} error count exceeds threshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = each.value
  }

  alarm_actions = var.alarm_sns_arns
  tags          = var.tags

  lifecycle {
    ignore_changes = [tags_all]
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  for_each = toset(var.lambda_function_names)

  alarm_name          = "${each.value}-ThrottleAlarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = var.alarm_period_seconds
  statistic           = "Sum"
  threshold           = var.throttle_alarm_threshold
  alarm_description   = "Alarm when ${each.value} throttle count exceeds threshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = each.value
  }

  alarm_actions = var.alarm_sns_arns
  tags          = var.tags

  lifecycle {
    ignore_changes = [tags_all]
  }
}

resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx" {
  for_each = toset(var.api_gateway_ids)

  alarm_name          = "APIGateway-${each.value}-5xxAlarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = var.alarm_period_seconds
  statistic           = "Sum"
  threshold           = var.api_5xx_alarm_threshold
  alarm_description   = "Alarm when HTTP API ${each.value} 5XX error count exceeds threshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = each.value
  }

  alarm_actions = var.alarm_sns_arns
  tags          = var.tags

  lifecycle {
    ignore_changes = [tags_all]
  }
}

resource "aws_cloudwatch_dashboard" "this" {
  count          = var.create_dashboard ? 1 : 0
  dashboard_name = var.dashboard_name

  dashboard_body = jsonencode({
    widgets = concat(
      [
        {
          type   = "metric"
          x      = 0
          y      = 0
          width  = 24
          height = 6
          properties = {
            metrics = flatten([
              for fn in var.lambda_function_names : [
                ["AWS/Lambda", "Invocations", "FunctionName", fn, { "stat" = "Sum", "label" = "${fn} Invocations" }],
                ["AWS/Lambda", "Errors", "FunctionName", fn, { "stat" = "Sum", "label" = "${fn} Errors" }],
                ["AWS/Lambda", "Throttles", "FunctionName", fn, { "stat" = "Sum", "label" = "${fn} Throttles" }],
                ["AWS/Lambda", "Duration", "FunctionName", fn, { "stat" = "Average", "label" = "${fn} Duration (ms)" }],
                [{ "separator" = true }],
              ]
            ])
            period = 300
            stat   = "Sum"
            region = var.region
            title  = "Lambda - All Functions"
          }
        },
        {
          type   = "metric"
          x      = 0
          y      = 6
          width  = 24
          height = 6
          properties = {
            metrics = flatten([
              for api in var.api_gateway_ids : [
                ["AWS/ApiGateway", "Count", "ApiId", api, { "stat" = "Sum", "label" = "${api} Requests" }],
                ["AWS/ApiGateway", "5XXError", "ApiId", api, { "stat" = "Sum", "label" = "${api} 5XX" }],
                ["AWS/ApiGateway", "Latency", "ApiId", api, { "stat" = "Average", "label" = "${api} Latency" }],
                [{ "separator" = true }],
              ]
            ])
            period = 300
            stat   = "Sum"
            region = var.region
            title  = "HTTP APIs - All Gateways"
          }
        }
      ]
    )
  })
}
