locals {
  name_prefix = "ecommerce-prod"
  common_tags = {
    Environment = "prod"
    Project     = "ecommerce-microservices"
    ManagedBy   = "terraform"
  }
  deployment_bucket = "ecommerce-lambda-deployments-prod"
}

module "dynamodb_products" {
  source = "../../modules/dynamodb"

  table_name             = "${local.name_prefix}-products"
  hash_key               = "productId"
  billing_mode           = "PROVISIONED"
  server_side_encryption = true
  point_in_time_recovery = true

  read_capacity  = 10
  write_capacity = 5

  attributes = [
    { name = "productId", type = "S" },
    { name = "category", type = "S" },
  ]

  global_secondary_indexes = [
    {
      name            = "CategoryIndex"
      hash_key        = "category"
      projection_type = "ALL"
    },
  ]

  tags = local.common_tags
}

module "dynamodb_orders" {
  source = "../../modules/dynamodb"

  table_name             = "${local.name_prefix}-orders"
  hash_key               = "orderId"
  billing_mode           = "PROVISIONED"
  server_side_encryption = true
  point_in_time_recovery = true

  read_capacity  = 10
  write_capacity = 5

  attributes = [
    { name = "orderId", type = "S" },
    { name = "userId", type = "S" },
  ]

  global_secondary_indexes = [
    {
      name            = "UserOrderIndex"
      hash_key        = "userId"
      projection_type = "ALL"
    },
  ]

  tags = local.common_tags
}

module "dynamodb_cart" {
  source = "../../modules/dynamodb"

  table_name             = "${local.name_prefix}-cart"
  hash_key               = "userId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true
  point_in_time_recovery = true

  attributes = [
    { name = "userId", type = "S" },
  ]

  tags = local.common_tags
}

module "iam_auth" {
  source = "../../modules/iam"

  role_name             = "${local.name_prefix}-auth-lambda"
  cognito_user_pool_arn = aws_cognito_user_pool.this.arn
  enable_cognito_access = true
  tags                  = local.common_tags
}

module "iam_product" {
  source = "../../modules/iam"

  role_name          = "${local.name_prefix}-product-lambda"
  dynamodb_table_arn = module.dynamodb_products.arn
  tags               = local.common_tags
}

module "iam_order" {
  source = "../../modules/iam"

  role_name          = "${local.name_prefix}-order-lambda"
  dynamodb_table_arn = module.dynamodb_orders.arn
  sns_publish_topic_arns = [
    module.sns_order_events.arn,
  ]
  tags = local.common_tags
}

module "iam_cart" {
  source = "../../modules/iam"

  role_name          = "${local.name_prefix}-cart-lambda"
  dynamodb_table_arn = module.dynamodb_cart.arn
  tags               = local.common_tags
}

module "iam_payment" {
  source = "../../modules/iam"

  role_name = "${local.name_prefix}-payment-lambda"
  sns_publish_topic_arns = [
    module.sns_payment_events.arn,
  ]
  tags = local.common_tags
}

module "iam_notification" {
  source = "../../modules/iam"

  role_name = "${local.name_prefix}-notification-lambda"
  sns_subscribe_topic_arns = [
    module.sns_order_events.arn,
    module.sns_payment_events.arn,
  ]
  tags = local.common_tags
}

module "iam_frontend" {
  source = "../../modules/iam"

  role_name = "${local.name_prefix}-frontend-lambda"
  tags      = local.common_tags
}

module "lambda_auth" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-auth"
  role_arn      = module.iam_auth.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "auth/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV        = "production"
    COGNITO_POOL_ID = aws_cognito_user_pool.this.id
  }
  tags = local.common_tags
}

module "lambda_product" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-product"
  role_arn      = module.iam_product.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "product/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV       = "production"
    PRODUCTS_TABLE = module.dynamodb_products.name
  }
  tags = local.common_tags
}

module "lambda_order" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-order"
  role_arn      = module.iam_order.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "order/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV     = "production"
    ORDERS_TABLE = module.dynamodb_orders.name
  }
  tags = local.common_tags
}

module "lambda_cart" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-cart"
  role_arn      = module.iam_cart.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "cart/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV   = "production"
    CART_TABLE = module.dynamodb_cart.name
  }
  tags = local.common_tags
}

module "lambda_payment" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-payment"
  role_arn      = module.iam_payment.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "payment/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV = "production"
  }
  tags = local.common_tags
}

module "lambda_notification" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-notification"
  role_arn      = module.iam_notification.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "notification/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV = "production"
  }
  tags = local.common_tags
}

module "lambda_frontend" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-frontend"
  role_arn      = module.iam_frontend.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "frontend/latest.zip"
  publish       = true
  alias_name    = "prod"
  environment_variables = {
    NODE_ENV = "production"
  }
  tags = local.common_tags
}

resource "aws_cognito_user_pool" "this" {
  name = "${local.name_prefix}-user-pool"

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 12
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  tags = local.common_tags
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${local.name_prefix}-client"
  user_pool_id = aws_cognito_user_pool.this.id

  generate_secret = true

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]
}

resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${local.name_prefix}-auth"
  user_pool_id = aws_cognito_user_pool.this.id
}

module "sns_order_events" {
  source = "../../modules/sns"

  topic_name   = "${local.name_prefix}-order-events"
  display_name = "Order Events"
  tags         = local.common_tags
}

module "sns_payment_events" {
  source = "../../modules/sns"

  topic_name   = "${local.name_prefix}-payment-events"
  display_name = "Payment Events"
  tags         = local.common_tags
}

module "api_gateway" {
  source = "../../modules/api-gateway"

  api_name    = "${local.name_prefix}-api"
  description = "E-commerce microservices API (prod)"
  stage_name  = "v1"

  routes = {
    auth         = { path_part = "auth", lambda_invoke_arn = module.lambda_auth.alias_invoke_arn, lambda_function_name = module.lambda_auth.function_name }
    product      = { path_part = "products", lambda_invoke_arn = module.lambda_product.alias_invoke_arn, lambda_function_name = module.lambda_product.function_name }
    order        = { path_part = "orders", lambda_invoke_arn = module.lambda_order.alias_invoke_arn, lambda_function_name = module.lambda_order.function_name }
    cart         = { path_part = "cart", lambda_invoke_arn = module.lambda_cart.alias_invoke_arn, lambda_function_name = module.lambda_cart.function_name }
    payment      = { path_part = "payments", lambda_invoke_arn = module.lambda_payment.alias_invoke_arn, lambda_function_name = module.lambda_payment.function_name }
    notification = { path_part = "notifications", lambda_invoke_arn = module.lambda_notification.alias_invoke_arn, lambda_function_name = module.lambda_notification.function_name }
    frontend     = { path_part = "frontend", lambda_invoke_arn = module.lambda_frontend.alias_invoke_arn, lambda_function_name = module.lambda_frontend.function_name }
  }

  lambda_dependency_arns = [
    module.lambda_auth.qualified_arn,
    module.lambda_product.qualified_arn,
    module.lambda_order.qualified_arn,
    module.lambda_cart.qualified_arn,
    module.lambda_payment.qualified_arn,
    module.lambda_notification.qualified_arn,
    module.lambda_frontend.qualified_arn,
  ]

  tags = local.common_tags
}

module "cloudwatch" {
  source = "../../modules/cloudwatch"

  lambda_function_names = [
    module.lambda_auth.function_name,
    module.lambda_product.function_name,
    module.lambda_order.function_name,
    module.lambda_cart.function_name,
    module.lambda_payment.function_name,
    module.lambda_notification.function_name,
    module.lambda_frontend.function_name,
  ]
  api_gateway_names = [
    module.api_gateway.api_name,
  ]
  log_retention_days    = 90
  create_dashboard      = true
  dashboard_name        = "${local.name_prefix}-dashboard"
  region                = var.aws_region
  error_alarm_threshold = 1
  alarm_sns_arns        = [module.sns_order_events.arn]
  tags                  = local.common_tags
}
