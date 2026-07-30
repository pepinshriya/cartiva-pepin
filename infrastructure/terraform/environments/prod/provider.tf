provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "prod"
      Project     = "ecommerce-microservices"
      ManagedBy   = "terraform"
    }
  }
}
