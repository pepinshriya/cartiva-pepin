terraform {
  backend "s3" {
    bucket  = "ecommerce-terraform-state-726101441380"
    key     = "monitoring/terraform.tfstate"
    region  = "ap-southeast-1"
    encrypt = true
  }
}
