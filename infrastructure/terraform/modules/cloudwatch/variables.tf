variable "lambda_function_names" {
  description = "List of Lambda function names to monitor"
  type        = list(string)
  default     = []
}

variable "api_gateway_names" {
  description = "List of API Gateway API names to monitor"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}

variable "alarm_period_seconds" {
  description = "Alarm evaluation period in seconds"
  type        = number
  default     = 300
}

variable "error_alarm_threshold" {
  description = "Error alarm threshold (sum over period)"
  type        = number
  default     = 1
}

variable "throttle_alarm_threshold" {
  description = "Throttle alarm threshold (sum over period)"
  type        = number
  default     = 1
}

variable "api_5xx_alarm_threshold" {
  description = "API Gateway 5XX alarm threshold (sum over period)"
  type        = number
  default     = 1
}

variable "alarm_sns_arns" {
  description = "List of SNS topic ARNs for alarm notifications"
  type        = list(string)
  default     = []
}

variable "create_dashboard" {
  description = "Create a CloudWatch dashboard"
  type        = bool
  default     = false
}

variable "dashboard_name" {
  description = "CloudWatch dashboard name"
  type        = string
  default     = "Ecommerce-Microservices"
}

variable "region" {
  description = "AWS region for dashboard"
  type        = string
  default     = "ap-southeast-1"
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
