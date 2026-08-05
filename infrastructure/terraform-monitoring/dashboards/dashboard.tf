resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-Overview"

  dashboard_body = jsonencode({
    widgets = [
      # ==========================================
      # SECTION 1: LAMBDA OVERVIEW
      # ==========================================
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", data.aws_lambda_function.product_service.function_name],
            [".", ".", ".", data.aws_lambda_function.cart_service.function_name],
            [".", ".", ".", data.aws_lambda_function.order_service.function_name],
            [".", ".", ".", data.aws_lambda_function.payment_service.function_name],
            [".", ".", ".", data.aws_lambda_function.inventory_service.function_name],
            [".", ".", ".", data.aws_lambda_function.customer_service.function_name],
            [".", ".", ".", data.aws_lambda_function.analytics_service.function_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Invocations"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", data.aws_lambda_function.product_service.function_name],
            [".", ".", ".", data.aws_lambda_function.cart_service.function_name],
            [".", ".", ".", data.aws_lambda_function.order_service.function_name],
            [".", ".", ".", data.aws_lambda_function.payment_service.function_name],
            [".", ".", ".", data.aws_lambda_function.inventory_service.function_name],
            [".", ".", ".", data.aws_lambda_function.customer_service.function_name],
            [".", ".", ".", data.aws_lambda_function.analytics_service.function_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Errors"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", data.aws_lambda_function.product_service.function_name],
            [".", ".", ".", data.aws_lambda_function.cart_service.function_name],
            [".", ".", ".", data.aws_lambda_function.order_service.function_name],
            [".", ".", ".", data.aws_lambda_function.payment_service.function_name],
            [".", ".", ".", data.aws_lambda_function.inventory_service.function_name],
            [".", ".", ".", data.aws_lambda_function.customer_service.function_name],
            [".", ".", ".", data.aws_lambda_function.analytics_service.function_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Duration"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Throttles", "FunctionName", data.aws_lambda_function.product_service.function_name],
            [".", ".", ".", data.aws_lambda_function.cart_service.function_name],
            [".", ".", ".", data.aws_lambda_function.order_service.function_name],
            [".", ".", ".", data.aws_lambda_function.payment_service.function_name],
            [".", ".", ".", data.aws_lambda_function.inventory_service.function_name],
            [".", ".", ".", data.aws_lambda_function.customer_service.function_name],
            [".", ".", ".", data.aws_lambda_function.analytics_service.function_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Throttles"
        }
      },

      # ==========================================
      # SECTION 2: HTTP API GATEWAY
      # ==========================================
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiId", var.api_id_product],
            [".", ".", ".", var.api_id_cart],
            [".", ".", ".", var.api_id_payment],
            [".", ".", ".", var.api_id_customer],
            [".", ".", ".", var.api_id_analytics]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway Requests (Count)"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiId", var.api_id_product],
            [".", ".", ".", var.api_id_cart],
            [".", ".", ".", var.api_id_payment],
            [".", ".", ".", var.api_id_customer],
            [".", ".", ".", var.api_id_analytics]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway Latency"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "4XXError", "ApiId", var.api_id_product],
            [".", ".", ".", var.api_id_cart],
            [".", ".", ".", var.api_id_payment],
            [".", ".", ".", var.api_id_customer],
            [".", ".", ".", var.api_id_analytics]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway 4XX Errors"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "5XXError", "ApiId", var.api_id_product],
            [".", ".", ".", var.api_id_cart],
            [".", ".", ".", var.api_id_payment],
            [".", ".", ".", var.api_id_customer],
            [".", ".", ".", var.api_id_analytics]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway 5XX Errors"
        }
      },

      # ==========================================
      # SECTION 3: DYNAMODB
      # ==========================================
      {
        type   = "metric"
        x      = 0
        y      = 24
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", data.aws_dynamodb_table.product.name],
            [".", ".", ".", data.aws_dynamodb_table.cart.name],
            [".", ".", ".", data.aws_dynamodb_table.inventory.name],
            [".", ".", ".", data.aws_dynamodb_table.order.name],
            [".", ".", ".", data.aws_dynamodb_table.payment.name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Consumed Read Capacity"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 24
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedWriteCapacityUnits", "TableName", data.aws_dynamodb_table.product.name],
            [".", ".", ".", data.aws_dynamodb_table.cart.name],
            [".", ".", ".", data.aws_dynamodb_table.inventory.name],
            [".", ".", ".", data.aws_dynamodb_table.order.name],
            [".", ".", ".", data.aws_dynamodb_table.payment.name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Consumed Write Capacity"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 30
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ThrottledRequests", "TableName", data.aws_dynamodb_table.product.name],
            [".", ".", ".", data.aws_dynamodb_table.cart.name],
            [".", ".", ".", data.aws_dynamodb_table.inventory.name],
            [".", ".", ".", data.aws_dynamodb_table.order.name],
            [".", ".", ".", data.aws_dynamodb_table.payment.name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Throttled Requests"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 30
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "SuccessfulRequestLatency", "TableName", data.aws_dynamodb_table.product.name],
            [".", ".", ".", data.aws_dynamodb_table.cart.name],
            [".", ".", ".", data.aws_dynamodb_table.inventory.name],
            [".", ".", ".", data.aws_dynamodb_table.order.name],
            [".", ".", ".", data.aws_dynamodb_table.payment.name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Successful Request Latency"
        }
      }
    ]
  })
}
