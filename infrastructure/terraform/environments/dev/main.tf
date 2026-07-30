locals {
  name_prefix = "ecommerce-dev"
  common_tags = {
    Environment = "dev"
    Project     = "ecommerce-microservices"
    ManagedBy   = "terraform"
  }
  deployment_bucket = "ecommerce-lambda-deployments-dev"
}

module "dynamodb_cart" {
  source = "../../modules/dynamodb"

  table_name             = "${local.name_prefix}-cart"
  hash_key               = "userId"
  billing_mode           = "PAY_PER_REQUEST"
  server_side_encryption = true

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

  role_name = "${local.name_prefix}-product-lambda"
  tags      = local.common_tags
}

module "iam_order" {
  source = "../../modules/iam"

  role_name = "${local.name_prefix}-order-lambda"
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
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "auth/latest.zip"
  publish       = true
  environment_variables = {
    NODE_ENV        = "dev"
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
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "product/latest.zip"
  publish       = true
  environment_variables = {
    NODE_ENV = "dev"
  }
  tags = local.common_tags
}

module "lambda_order" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-order"
  role_arn      = module.iam_order.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "order/latest.zip"
  publish       = true
  environment_variables = {
    NODE_ENV = "dev"
  }
  tags = local.common_tags
}

module "lambda_cart" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-cart"
  role_arn      = module.iam_cart.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "cart/latest.zip"
  publish       = true
  environment_variables = {
    NODE_ENV   = "dev"
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
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "payment/latest.zip"
  publish       = true
  environment_variables = {
    NODE_ENV = "dev"
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
  environment_variables = {
    NODE_ENV = "dev"
  }
  tags = local.common_tags
}

module "lambda_frontend" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-frontend"
  role_arn      = module.iam_frontend.role_arn
  handler       = "index"
  runtime       = "nodejs20.x"
  memory_size   = 256
  timeout       = 30
  s3_bucket     = local.deployment_bucket
  s3_key        = "frontend/latest.zip"
  publish       = true
  environment_variables = {
    NODE_ENV = "dev"
  }
  tags = local.common_tags
}

resource "aws_cognito_user_pool" "this" {
  name = "${local.name_prefix}-user-pool"

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  tags = local.common_tags
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${local.name_prefix}-client"
  user_pool_id = aws_cognito_user_pool.this.id

  generate_secret = false

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
  description = "E-commerce microservices API (dev)"
  stage_name  = "v1"

  routes = {
    auth         = { path_part = "auth", lambda_invoke_arn = module.lambda_auth.invoke_arn, lambda_function_name = module.lambda_auth.function_name }
    product      = { path_part = "products", lambda_invoke_arn = module.lambda_product.invoke_arn, lambda_function_name = module.lambda_product.function_name }
    order        = { path_part = "orders", lambda_invoke_arn = module.lambda_order.invoke_arn, lambda_function_name = module.lambda_order.function_name }
    cart         = { path_part = "cart", lambda_invoke_arn = module.lambda_cart.invoke_arn, lambda_function_name = module.lambda_cart.function_name }
    payment      = { path_part = "payments", lambda_invoke_arn = module.lambda_payment.invoke_arn, lambda_function_name = module.lambda_payment.function_name }
    notification = { path_part = "notifications", lambda_invoke_arn = module.lambda_notification.invoke_arn, lambda_function_name = module.lambda_notification.function_name }
    frontend     = { path_part = "frontend", lambda_invoke_arn = module.lambda_frontend.invoke_arn, lambda_function_name = module.lambda_frontend.function_name }
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
  log_retention_days    = 14
  create_dashboard      = true
  dashboard_name        = "${local.name_prefix}-dashboard"
  region                = var.aws_region
  error_alarm_threshold = 3
  alarm_sns_arns        = [module.sns_order_events.arn]
  tags                  = local.common_tags
}
