"""
Lex8 AWS KMS helpers — Sign and verify forensic narrative payloads.
Per-tenant non-exportable signing keys.
"""

import base64
import hashlib

import boto3


def get_kms_client(region: str = "us-east-1"):
    """Get a KMS client."""
    return boto3.client("kms", region_name=region)


def sign_payload(payload: bytes, key_arn: str, region: str = "us-east-1") -> dict:
    """
    Sign a payload using a tenant's KMS key.
    Returns dict with signature (base64) and digest.
    """
    kms = get_kms_client(region)
    digest = hashlib.sha256(payload).digest()

    response = kms.sign(
        KeyId=key_arn,
        Message=digest,
        MessageType="DIGEST",
        SigningAlgorithm="RSASSA_PKCS1_V1_5_SHA_256",
    )

    signature_b64 = base64.b64encode(response["Signature"]).decode("utf-8")
    return {
        "signature": signature_b64,
        "algorithm": "RSASSA_PKCS1_V1_5_SHA_256",
        "key_arn": key_arn,
        "digest_hex": hashlib.sha256(payload).hexdigest(),
    }


def verify_signature(payload: bytes, signature_b64: str, key_arn: str, region: str = "us-east-1") -> bool:
    """Verify a KMS signature against a payload."""
    kms = get_kms_client(region)
    digest = hashlib.sha256(payload).digest()
    signature = base64.b64decode(signature_b64)

    try:
        kms.verify(
            KeyId=key_arn,
            Message=digest,
            MessageType="DIGEST",
            Signature=signature,
            SigningAlgorithm="RSASSA_PKCS1_V1_5_SHA_256",
        )
        return True
    except kms.exceptions.KMSInvalidSignatureException:
        return False


if __name__ == "__main__":
    import os
    key_arn = os.getenv("AWS_KMS_KEY_ARN", "")
    if not key_arn:
        print("Set AWS_KMS_KEY_ARN to test signing.")
    else:
        test_payload = b"Acme Corp. v. Beta Industries - Forensic Narrative"
        print(f"Signing: {test_payload.decode()}")
        result = sign_payload(test_payload, key_arn)
        print(f"Signature: {result['signature'][:40]}...")
        print(f"Digest: {result['digest_hex']}")
        valid = verify_signature(test_payload, result["signature"], key_arn)
        print(f"Verified: {valid}")
