"""
Lex8 Gateway configuration — loaded from the repo-local env file.
"""

from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[2] / "env"


class Settings(BaseSettings):
    """Gateway settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: int = 20  # INFO

    # AWS
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_DEFAULT_REGION: str = "us-east-1"
    AWS_KMS_KEY_ARN: str = ""
    AWS_S3_BUCKET: str = ""

    # LLM
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"

    # Legal APIs
    COURTLISTENER_API_TOKEN: str = ""
    VOYAGE_API_KEY: str = ""

    # Local services
    POSTGRES_URL: str = "postgresql://lex8:lex8_dev@localhost:5432/lex8"
    REDIS_URL: str = "redis://localhost:6379"
    REDPANDA_BROKER: str = "localhost:9092"
    QDRANT_URL: str = "http://localhost:6333"
    OPENSEARCH_URL: str = "http://localhost:9200"

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug", "development"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "production"}:
                return False
        return value


settings = Settings()
