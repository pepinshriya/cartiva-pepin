variable "api_name" {
  description = "API Gateway name"
  type        = string
}

variable "description" {
  description = "API description"
  type        = string
  default     = null
}

variable "stage_name" {
  description = "Deployment stage name"
  type        = string
  default     = "v1"
}

variable "endpoint_types" {
  description = "List of endpoint configuration types"
  type        = list(string)
  default     = ["REGIONAL"]
}

variable "routes" {
  description = "Map of route configurations"
  type = map(object({
    path_part            = string
    lambda_invoke_arn    = string
    lambda_function_name = string
  }))
}

variable "lambda_dependency_arns" {
  description = "List of Lambda function ARNs to force API redeployment on function update"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
