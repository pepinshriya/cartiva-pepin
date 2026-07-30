data "archive_file" "this" {
  count       = var.create_package ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/.build/${var.function_name}.zip"

  source {
    content  = var.source_code
    filename = "${var.handler}.js"
  }
}

resource "aws_lambda_function" "this" {
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
