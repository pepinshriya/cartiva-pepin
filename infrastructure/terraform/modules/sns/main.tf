resource "aws_sns_topic" "this" {
  name              = var.topic_name
  display_name      = var.display_name
  kms_master_key_id = var.kms_master_key_id

  tags = var.tags
}

resource "aws_sns_topic_policy" "this" {
  count  = var.policy_document != null ? 1 : 0
  arn    = aws_sns_topic.this.arn
  policy = var.policy_document
}
