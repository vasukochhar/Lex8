"""
Lex8 S3 Storage — Region-locked document storage with content-addressed dedup.
"""

import hashlib

import boto3


def get_s3_client(region: str = "us-east-1"):
    """Get an S3 client for the specified region."""
    return boto3.client("s3", region_name=region)


def upload_document(
    file_bytes: bytes,
    tenant_id: str,
    bucket: str,
    mime_type: str = "application/pdf",
    region: str = "us-east-1",
) -> dict:
    """
    Upload a document with content-addressed key.
    Returns dict with s3_key, content_hash, size_bytes.
    Deduplicates: if same hash exists, returns existing ref.
    """
    content_hash = hashlib.sha256(file_bytes).hexdigest()
    s3_key = f"{tenant_id}/{content_hash}"

    s3 = get_s3_client(region)

    # Check if already exists (dedup)
    try:
        s3.head_object(Bucket=bucket, Key=s3_key)
        return {
            "s3_key": s3_key,
            "content_hash": content_hash,
            "size_bytes": len(file_bytes),
            "deduplicated": True,
        }
    except s3.exceptions.ClientError:
        pass

    # Upload
    s3.put_object(
        Bucket=bucket,
        Key=s3_key,
        Body=file_bytes,
        ContentType=mime_type,
        ServerSideEncryption="aws:kms",
        Metadata={
            "tenant_id": tenant_id,
            "content_hash": content_hash,
        },
    )

    return {
        "s3_key": s3_key,
        "content_hash": content_hash,
        "size_bytes": len(file_bytes),
        "deduplicated": False,
    }


def download_document(s3_key: str, bucket: str, region: str = "us-east-1") -> bytes:
    """Download a document from S3."""
    s3 = get_s3_client(region)
    response = s3.get_object(Bucket=bucket, Key=s3_key)
    return response["Body"].read()


def generate_presigned_url(s3_key: str, bucket: str, expires_in: int = 3600, region: str = "us-east-1") -> str:
    """Generate a presigned download URL (1 hour default)."""
    s3 = get_s3_client(region)
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": s3_key},
        ExpiresIn=expires_in,
    )
