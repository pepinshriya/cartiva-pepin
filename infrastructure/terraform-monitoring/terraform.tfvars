aws_region   = "ap-southeast-1"
environment  = "prod"
project_name = "ecommerce-monitoring"

# Default Alarm Thresholds based on AWS Best Practices
lambda_alarm_errors_threshold      = 1
lambda_alarm_throttles_threshold   = 1
lambda_alarm_duration_threshold_ms = 3000

api_gateway_alarm_5xx_errors_threshold = 1
api_gateway_alarm_latency_threshold_ms = 3000

dynamodb_alarm_throttled_requests_threshold = 0
dynamodb_alarm_system_errors_threshold      = 0
