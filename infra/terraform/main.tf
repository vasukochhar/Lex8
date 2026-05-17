terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "kms_keys" {
  source = "./modules/kms"
  tenant_name = "demo-tenant"
}

module "s3_buckets" {
  source = "./modules/s3"
  bucket_name = "lex8-docs-us-east-1"
}
