variable "tenant_name" {
  type = string
}

resource "aws_kms_key" "tenant_key" {
  description             = "Forensic narrative signing key for ${var.tenant_name}"
  deletion_window_in_days = 10
  customer_master_key_spec = "RSA_2048"
  key_usage                = "SIGN_VERIFY"
}

resource "aws_kms_alias" "tenant_key_alias" {
  name          = "alias/lex8-${var.tenant_name}-signing"
  target_key_id = aws_kms_key.tenant_key.key_id
}

output "key_arn" {
  value = aws_kms_key.tenant_key.arn
}
