variable "function_name" {
  description = "Lambda function name"
  type        = string
}

variable "role_arn" {
  description = "IAM role ARN to assign to the function"
  type        = string
}

variable "handler" {
  description = "Lambda handler file name (without .js extension)"
  type        = string
}

variable "runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs20.x"
}

variable "memory_size" {
  description = "Function memory size in MB"
  type        = number
  default     = 256
}

variable "timeout" {
  description = "Function timeout in seconds"
  type        = number
  default     = 30
}

variable "publish" {
  description = "Publish a new version on every update"
  type        = bool
  default     = false
}

variable "alias_name" {
  description = "Name of the Lambda alias to create (null disables alias creation)"
  type        = string
  default     = null
}

variable "environment_variables" {
  description = "Environment variables for the function"
  type        = map(string)
  default     = {}
}

variable "s3_bucket" {
  description = "S3 bucket name containing the deployment package"
  type        = string
  default     = null
}

variable "s3_key" {
  description = "S3 key of the deployment package"
  type        = string
  default     = null
}

variable "s3_object_version" {
  description = "S3 object version of the deployment package"
  type        = string
  default     = null
}

variable "source_code" {
  description = "Inline source code for the Lambda handler"
  type        = string
  default     = null
}

variable "create_package" {
  description = "Whether to create an inline deployment package from source_code"
  type        = bool
  default     = false
}

variable "subnet_ids" {
  description = "List of subnet IDs for VPC config"
  type        = list(string)
  default     = []
}

variable "security_group_ids" {
  description = "List of security group IDs for VPC config"
  type        = list(string)
  default     = []
}

variable "file_system_arn" {
  description = "EFS file system ARN for Lambda mount"
  type        = string
  default     = null
}

variable "mount_path" {
  description = "Local mount path for EFS"
  type        = string
  default     = "/mnt/efs"
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
