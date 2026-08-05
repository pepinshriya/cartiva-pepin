# API Gateway (v2) requires the API ID for the data source.
# Variables are defined here so you can provide the exact IDs in terraform.tfvars.

variable "api_id_product" {
  description = "ID for product-service-pepin-API"
  type        = string
  default     = "" # Provide real ID in tfvars
}

variable "api_id_cart" {
  description = "ID for cart-service-api-pepin"
  type        = string
  default     = ""
}

variable "api_id_payment" {
  description = "ID for payment-service-api-pepin"
  type        = string
  default     = ""
}

variable "api_id_customer" {
  description = "ID for customer-service-pepin-API"
  type        = string
  default     = ""
}

variable "api_id_analytics" {
  description = "ID for analytics-service-pepin-API"
  type        = string
  default     = ""
}

# We use count here so Terraform doesn't fail if the ID is not yet provided.
data "aws_apigatewayv2_api" "product_api" {
  count  = var.api_id_product != "" ? 1 : 0
  api_id = var.api_id_product
}

data "aws_apigatewayv2_api" "cart_api" {
  count  = var.api_id_cart != "" ? 1 : 0
  api_id = var.api_id_cart
}

data "aws_apigatewayv2_api" "payment_api" {
  count  = var.api_id_payment != "" ? 1 : 0
  api_id = var.api_id_payment
}

data "aws_apigatewayv2_api" "customer_api" {
  count  = var.api_id_customer != "" ? 1 : 0
  api_id = var.api_id_customer
}

data "aws_apigatewayv2_api" "analytics_api" {
  count  = var.api_id_analytics != "" ? 1 : 0
  api_id = var.api_id_analytics
}
