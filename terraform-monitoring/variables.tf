variable "aws_region" {
  description = "The AWS region where the monitoring resources will be created"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "The environment name (e.g., prod, staging)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "ecommerce-monitoring"
}

# --- Alarm Threshold Variables ---

variable "lambda_alarm_errors_threshold" {
  description = "Threshold for Lambda errors alarm"
  type        = number
  default     = 1
}

variable "lambda_alarm_throttles_threshold" {
  description = "Threshold for Lambda throttles alarm"
  type        = number
  default     = 1
}

variable "lambda_alarm_duration_threshold_ms" {
  description = "Threshold for Lambda duration alarm in milliseconds"
  type        = number
  default     = 3000
}

variable "api_gateway_alarm_5xx_errors_threshold" {
  description = "Threshold for HTTP API Gateway 5XX errors alarm"
  type        = number
  default     = 1
}

variable "api_gateway_alarm_latency_threshold_ms" {
  description = "Threshold for HTTP API Gateway latency alarm in milliseconds"
  type        = number
  default     = 3000
}

variable "dynamodb_alarm_throttled_requests_threshold" {
  description = "Threshold for DynamoDB throttled requests alarm"
  type        = number
  default     = 0
}

variable "dynamodb_alarm_system_errors_threshold" {
  description = "Threshold for DynamoDB system errors alarm"
  type        = number
  default     = 0
}
