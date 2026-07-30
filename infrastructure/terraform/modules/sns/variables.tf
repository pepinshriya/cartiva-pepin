variable "topic_name" {
  description = "SNS topic name"
  type        = string
}

variable "display_name" {
  description = "Display name for the topic (256 chars max)"
  type        = string
  default     = null
}

variable "kms_master_key_id" {
  description = "KMS key ID for encryption (defaults to AWS managed key)"
  type        = string
  default     = null
}

variable "policy_document" {
  description = "JSON policy document for the SNS topic"
  type        = string
  default     = null
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
