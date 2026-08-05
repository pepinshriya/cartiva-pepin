data "aws_dynamodb_table" "product" {
  name = "product"
}

data "aws_dynamodb_table" "cart" {
  name = "cart-pepin"
}

data "aws_dynamodb_table" "inventory" {
  name = "inventory-pepin"
}

data "aws_dynamodb_table" "order" {
  name = "order-pepin"
}

data "aws_dynamodb_table" "payment" {
  name = "payment-pepin"
}
