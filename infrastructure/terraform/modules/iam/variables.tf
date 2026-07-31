variable "role_name" {
  description = "IAM role name"
  type        = string
}

variable "enable_dynamodb_access" {
  description = "Create a least-privilege DynamoDB policy for this role"
  type        = bool
  default     = false
}

variable "dynamodb_table_arn" {
  description = "DynamoDB table ARN scoping the data access policy (required if enable_dynamodb_access is true)"
  type        = string
  default     = null

  validation {
    condition     = var.enable_dynamodb_access ? var.dynamodb_table_arn != null : true
    error_message = "dynamodb_table_arn must be set when enable_dynamodb_access is true."
  }
}

variable "enable_sns_publish" {
  description = "Create an SNS publish policy for this role"
  type        = bool
  default     = false
}

variable "sns_publish_topic_arns" {
  description = "List of SNS topic ARNs this role can publish to"
  type        = list(string)
  default     = []

  validation {
    condition     = var.enable_sns_publish ? length(var.sns_publish_topic_arns) > 0 : true
    error_message = "sns_publish_topic_arns must contain at least one ARN when enable_sns_publish is true."
  }
}

variable "enable_sns_subscribe" {
  description = "Create an SNS subscribe policy for this role"
  type        = bool
  default     = false
}

variable "sns_subscribe_topic_arns" {
  description = "List of SNS topic ARNs this role can subscribe to"
  type        = list(string)
  default     = []

  validation {
    condition     = var.enable_sns_subscribe ? length(var.sns_subscribe_topic_arns) > 0 : true
    error_message = "sns_subscribe_topic_arns must contain at least one ARN when enable_sns_subscribe is true."
  }
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
