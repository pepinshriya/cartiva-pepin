data "aws_iam_policy_document" "assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "this" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = var.tags
}

data "aws_iam_policy_document" "logs" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:log-group:/aws/lambda/*"]
  }
}

resource "aws_iam_policy" "logs" {
  name   = "${var.role_name}-logs"
  policy = data.aws_iam_policy_document.logs.json
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.logs.arn
}

data "aws_iam_policy_document" "dynamodb" {
  count = var.dynamodb_table_arn != null ? 1 : 0
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
    ]
    resources = [
      var.dynamodb_table_arn,
      "${var.dynamodb_table_arn}/index/*",
    ]
  }
}

resource "aws_iam_policy" "dynamodb" {
  count  = var.dynamodb_table_arn != null ? 1 : 0
  name   = "${var.role_name}-dynamodb"
  policy = data.aws_iam_policy_document.dynamodb[0].json
}

resource "aws_iam_role_policy_attachment" "dynamodb" {
  count      = var.dynamodb_table_arn != null ? 1 : 0
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.dynamodb[0].arn
}

data "aws_iam_policy_document" "sns_publish" {
  count = length(var.sns_publish_topic_arns) > 0 ? 1 : 0
  statement {
    effect    = "Allow"
    actions   = ["sns:Publish"]
    resources = var.sns_publish_topic_arns
  }
}

resource "aws_iam_policy" "sns_publish" {
  count  = length(var.sns_publish_topic_arns) > 0 ? 1 : 0
  name   = "${var.role_name}-sns-publish"
  policy = data.aws_iam_policy_document.sns_publish[0].json
}

resource "aws_iam_role_policy_attachment" "sns_publish" {
  count      = length(var.sns_publish_topic_arns) > 0 ? 1 : 0
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.sns_publish[0].arn
}

data "aws_iam_policy_document" "sns_subscribe" {
  count = length(var.sns_subscribe_topic_arns) > 0 ? 1 : 0
  statement {
    effect    = "Allow"
    actions   = ["sns:Subscribe", "sns:ListSubscriptionsByTopic"]
    resources = var.sns_subscribe_topic_arns
  }
}

resource "aws_iam_policy" "sns_subscribe" {
  count  = length(var.sns_subscribe_topic_arns) > 0 ? 1 : 0
  name   = "${var.role_name}-sns-subscribe"
  policy = data.aws_iam_policy_document.sns_subscribe[0].json
}

resource "aws_iam_role_policy_attachment" "sns_subscribe" {
  count      = length(var.sns_subscribe_topic_arns) > 0 ? 1 : 0
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.sns_subscribe[0].arn
}

data "aws_iam_policy_document" "cognito" {
  count = var.enable_cognito_access ? 1 : 0
  statement {
    effect = "Allow"
    actions = [
      "cognito-idp:ListUsers",
      "cognito-idp:AdminGetUser",
      "cognito-idp:AdminEnableUser",
      "cognito-idp:AdminDisableUser",
    ]
    resources = [var.cognito_user_pool_arn]
  }
}

resource "aws_iam_policy" "cognito" {
  count  = var.enable_cognito_access ? 1 : 0
  name   = "${var.role_name}-cognito"
  policy = data.aws_iam_policy_document.cognito[0].json
}

resource "aws_iam_role_policy_attachment" "cognito" {
  count      = var.enable_cognito_access ? 1 : 0
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.cognito[0].arn
}
