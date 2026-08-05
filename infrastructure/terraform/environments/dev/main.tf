locals {
  common_tags = {
    Environment = "dev"
    Project     = "ecommerce-microservices"
    ManagedBy   = "terraform"
  }
}

data "aws_iam_role" "existing_pepin" {
  name = "Ecommerce-pepin"
}

# --- DynamoDB Tables ---

module "dynamodb_cart" {
  source                 = "../../modules/dynamodb"
  table_name             = "cart-pepin"
  hash_key               = "userId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true
  attributes = [
    { name = "userId", type = "S" }
  ]
  tags = local.common_tags
}

module "dynamodb_product" {
  source                 = "../../modules/dynamodb"
  table_name             = "product"
  hash_key               = "productId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true
  attributes = [
    { name = "productId", type = "S" },
    { name = "category", type = "S" }
  ]
  global_secondary_indexes = [
    {
      name            = "CategoryIndex"
      hash_key        = "category"
      projection_type = "ALL"
    }
  ]
  tags = local.common_tags
}

module "dynamodb_inventory" {
  source                 = "../../modules/dynamodb"
  table_name             = "inventory-pepin"
  hash_key               = "productId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true
  attributes = [
    { name = "productId", type = "S" }
  ]
  tags = local.common_tags
}

module "dynamodb_order" {
  source                 = "../../modules/dynamodb"
  table_name             = "order-pepin"
  hash_key               = "userId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true
  attributes = [
    { name = "userId", type = "S" }
  ]
  tags = local.common_tags
}

module "dynamodb_payment" {
  source                 = "../../modules/dynamodb"
  table_name             = "payment-pepin"
  hash_key               = "orderId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true
  attributes = [
    { name = "orderId", type = "S" }
  ]
  tags = local.common_tags
}

# --- SNS Topics ---

module "sns_order_events" {
  source       = "../../modules/sns"
  topic_name   = "order-events-topic-pepin"
  display_name = "Order Events"
  tags         = local.common_tags
}

# --- Lambda Functions ---

module "lambda_product" {
  source                 = "../../modules/lambda"
  function_name          = "product-service-pepin"
  existing_function_name = "product-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

module "lambda_order" {
  source                 = "../../modules/lambda"
  function_name          = "order-service-pepin"
  existing_function_name = "order-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

module "lambda_cart" {
  source                 = "../../modules/lambda"
  function_name          = "cart-service-pepin"
  existing_function_name = "cart-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

module "lambda_payment" {
  source                 = "../../modules/lambda"
  function_name          = "payment-service-pepin"
  existing_function_name = "payment-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

module "lambda_inventory" {
  source                 = "../../modules/lambda"
  function_name          = "inventory-service-pepin"
  existing_function_name = "inventory-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

module "lambda_customer" {
  source                 = "../../modules/lambda"
  function_name          = "customer-service-pepin"
  existing_function_name = "customer-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

module "lambda_analytics" {
  source                 = "../../modules/lambda"
  function_name          = "analytics-service-pepin"
  existing_function_name = "analytics-service-pepin"
  alias_name             = "dev"
  role_arn               = data.aws_iam_role.existing_pepin.arn
  tags                   = local.common_tags
}

# --- API Gateways (HTTP API v2) ---

module "api_gateway_product" {
  source             = "../../modules/api-gateway"
  api_name           = "product-service-pepin-API"
  target_lambda_arn  = module.lambda_product.invoke_arn
  target_lambda_name = module.lambda_product.function_name
  tags               = local.common_tags
}

module "api_gateway_cart" {
  source             = "../../modules/api-gateway"
  api_name           = "cart-service-api-pepin"
  target_lambda_arn  = module.lambda_cart.invoke_arn
  target_lambda_name = module.lambda_cart.function_name
  tags               = local.common_tags
}

module "api_gateway_payment" {
  source             = "../../modules/api-gateway"
  api_name           = "payment-service-api-pepin"
  target_lambda_arn  = module.lambda_payment.invoke_arn
  target_lambda_name = module.lambda_payment.function_name
  tags               = local.common_tags
}

module "api_gateway_customer" {
  source             = "../../modules/api-gateway"
  api_name           = "customer-service-pepin-API"
  target_lambda_arn  = module.lambda_customer.invoke_arn
  target_lambda_name = module.lambda_customer.function_name
  tags               = local.common_tags
}

module "api_gateway_analytics" {
  source             = "../../modules/api-gateway"
  api_name           = "analytics-service-pepin-API"
  target_lambda_arn  = module.lambda_analytics.invoke_arn
  target_lambda_name = module.lambda_analytics.function_name
  tags               = local.common_tags
}
