variable "role_name" {
  description = "IAM role name"
  type        = string
}

variable "dynamodb_table_arn" {
  description = "DynamoDB table ARN for data access (null if not needed)"
  type        = string
  default     = null
}

variable "sns_publish_topic_arns" {
  description = "List of SNS topic ARNs this role can publish to"
  type        = list(string)
  default     = []
}

variable "sns_subscribe_topic_arns" {
  description = "List of SNS topic ARNs this role can subscribe to"
  type        = list(string)
  default     = []
}

variable "enable_cognito_access" {
  description = "Enable Cognito user pool admin access"
  type        = bool
  default     = false
}

variable "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN (required if enable_cognito_access is true)"
  type        = string
  default     = null

  validation {
    condition     = var.enable_cognito_access ? var.cognito_user_pool_arn != null : true
    error_message = "cognito_user_pool_arn must be set when enable_cognito_access is true."
  }
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
