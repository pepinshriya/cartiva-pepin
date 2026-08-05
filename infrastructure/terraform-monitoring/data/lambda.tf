data "aws_lambda_function" "product_service" {
  function_name = "product-service-pepin"
}

data "aws_lambda_function" "cart_service" {
  function_name = "cart-service-pepin"
}

data "aws_lambda_function" "order_service" {
  function_name = "order-service-pepin"
}

data "aws_lambda_function" "payment_service" {
  function_name = "payment-service-pepin"
}

data "aws_lambda_function" "inventory_service" {
  function_name = "inventory-service-pepin"
}

data "aws_lambda_function" "customer_service" {
  function_name = "customer-service-pepin"
}

data "aws_lambda_function" "analytics_service" {
  function_name = "analytics-service-pepin"
}
