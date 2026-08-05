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
  handler       = var.handler != null ? "${var.handler}.handler" : "index.handler"
  runtime       = var.runtime
  memory_size   = var.memory_size
  timeout       = var.timeout
  publish       = var.publish

  filename          = var.create_package ? "${path.module}/.build/${var.function_name}.zip" : null
  source_code_hash  = var.create_package ? data.archive_file.this[0].output_base64sha256 : null
  s3_bucket         = var.s3_bucket != null ? var.s3_bucket : "unused-placeholder-ignored-via-lifecycle"
  s3_key            = var.s3_key != null ? var.s3_key : "unused-placeholder-ignored-via-lifecycle"
  s3_object_version = var.s3_object_version

  dynamic "environment" {
    for_each = length(var.environment_variables) > 0 ? [1] : []
    content {
      variables = var.environment_variables
    }
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

  tracing_config {
    mode = "Active"
  }

  tags = var.tags

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
      s3_bucket,
      s3_key,
      s3_object_version,
      environment,
      role,
      handler,
      runtime,
      memory_size,
      timeout,
      publish,
      tags,
      tags_all,
      layers,
    ]
  }
}

resource "aws_lambda_alias" "this" {
  count = var.alias_name != null ? 1 : 0

  name             = var.alias_name
  description      = "Deployment alias for ${var.function_name}"
  function_name    = aws_lambda_function.this.arn
  function_version = aws_lambda_function.this.version

  lifecycle {
    ignore_changes = [function_version]
  }
}
