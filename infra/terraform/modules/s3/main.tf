variable "bucket_name" {
  type = string
}

resource "aws_s3_bucket" "docs" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "docs_block" {
  bucket = aws_s3_bucket.docs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "docs_encryption" {
  bucket = aws_s3_bucket.docs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
