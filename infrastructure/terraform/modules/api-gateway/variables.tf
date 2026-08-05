variable "api_name" {
  description = "API Gateway name"
  type        = string
}

variable "description" {
  description = "API description"
  type        = string
  default     = null
}

variable "target_lambda_arn" {
  description = "The ARN of the Lambda function to integrate with the $default HTTP route"
  type        = string
}

variable "target_lambda_name" {
  description = "The name of the Lambda function (used for resource-based permissions)"
  type        = string
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
