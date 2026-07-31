data "archive_file" "this" {
  count       = var.create_package ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/.build/${var.function_name}.zip"

  source {
    content  = var.source_code
    filename = "${var.handler}.js"
  }
}

data "aws_lambda_function" "existing" {
  count = var.existing_function_name != null ? 1 : 0

  function_name = var.existing_function_name
}

locals {
  function_arn  = var.existing_function_name != null ? data.aws_lambda_function.existing[0].arn : aws_lambda_function.this[0].arn
  function_name = var.existing_function_name != null ? data.aws_lambda_function.existing[0].function_name : aws_lambda_function.this[0].function_name
  invoke_arn    = var.existing_function_name != null ? data.aws_lambda_function.existing[0].invoke_arn : aws_lambda_function.this[0].invoke_arn
  qualified_arn = var.existing_function_name != null ? data.aws_lambda_function.existing[0].qualified_arn : aws_lambda_function.this[0].qualified_arn
}

resource "aws_lambda_function" "this" {
  count = var.existing_function_name != null ? 0 : 1

  function_name = var.function_name
  role          = var.role_arn
  handler       = "${var.handler}.handler"
  runtime       = var.runtime
  memory_size   = var.memory_size
  timeout       = var.timeout
  publish       = var.publish

  filename         = var.create_package ? "${path.module}/.build/${var.function_name}.zip" : null
  source_code_hash = var.create_package ? data.archive_file.this[0].output_base64sha256 : null

  s3_bucket         = var.s3_bucket
  s3_key            = var.s3_key
  s3_object_version = var.s3_object_version

  environment {
    variables = var.environment_variables
  }

  dynamic "file_system_config" {
    for_each = var.file_system_arn != null ? [1] : []
    content {
      arn              = var.file_system_arn
      local_mount_path = var.mount_path
    }
  }

  dynamic "vpc_config" {
    for_each = length(var.subnet_ids) > 0 ? [1] : []
    content {
      subnet_ids         = var.subnet_ids
      security_group_ids = var.security_group_ids
    }
  }

  tags = var.tags
}

resource "aws_lambda_alias" "this" {
  count = var.alias_name != null ? 1 : 0

  name             = var.alias_name
  description      = "Deployment alias for ${var.function_name}"
  function_name    = local.function_arn
  function_version = var.existing_function_name != null ? "$LATEST" : aws_lambda_function.this[0].version

  lifecycle {
    ignore_changes = [function_version]
  }
}
