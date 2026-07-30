variable "queue_name" {
  description = "SQS queue name"
  type        = string
}

variable "delay_seconds" {
  description = "Delay in seconds before messages become available"
  type        = number
  default     = 0
}

variable "max_message_size" {
  description = "Maximum message size in bytes (1024-262144)"
  type        = number
  default     = 262144
}

variable "message_retention_seconds" {
  description = "Message retention period in seconds (60-1209600)"
  type        = number
  default     = 345600
}

variable "receive_wait_time_seconds" {
  description = "Long polling wait time in seconds (0-20)"
  type        = number
  default     = 0
}

variable "visibility_timeout_seconds" {
  description = "Visibility timeout in seconds (0-43200)"
  type        = number
  default     = 30
}

variable "sqs_managed_sse_enabled" {
  description = "Use SQS-managed SSE keys"
  type        = bool
  default     = true
}

variable "kms_master_key_id" {
  description = "KMS key ID for encryption (only if sqs_managed_sse_enabled is false)"
  type        = string
  default     = null
}

variable "dead_letter_queue_arn" {
  description = "ARN of the DLQ for redrive policy"
  type        = string
  default     = null
}

variable "max_receive_count" {
  description = "Max receive count before sending to DLQ"
  type        = number
  default     = 5
}

variable "policy_document" {
  description = "JSON policy document for the SQS queue"
  type        = string
  default     = null
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
