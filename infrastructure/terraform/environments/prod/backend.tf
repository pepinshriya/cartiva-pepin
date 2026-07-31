terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.0"
    }
  }

  backend "s3" {
    bucket  = "ecommerce-terraform-state-726101441380"
    key     = "prod/terraform.tfstate"
    region  = "ap-southeast-1"
    encrypt = true
  }
}
