from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

DEV_JWT_SECRET = "dev-only-jwt-secret-change-before-production"
DEV_ENCRYPTION_KEY = "ezXm55ShNTmTHjwM4hQ6WlI7YzV7w3H0mR1mcF13lK8="
DEV_IP_PEPPER = "dev-only-ip-pepper"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("../../.env", ".env"), env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    app_name: str = "Aryan Enterprise Portfolio API"
    environment: Literal["development", "test", "production"] = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "sqlite+aiosqlite:///./portfolio.db"
    allowed_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:5173"]
    )
    allowed_hosts: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["localhost", "127.0.0.1", "testserver"]
    )
    auto_create_tables: bool = True

    jwt_secret: str = DEV_JWT_SECRET
    app_encryption_keys: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: [DEV_ENCRYPTION_KEY]
    )
    ip_hash_pepper: str = DEV_IP_PEPPER
    access_token_minutes: int = 30

    cookie_secure: bool = False
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"
    cookie_domain: str | None = None

    admin_email: str = "aryantembhekar294@gmail.com"
    admin_password: str = "change-me-now"
    admin_name: str = "Aryan Tembhekar | Portfolio"

    brevo_api_key: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True
    mail_from: str = "portfolio@example.com"
    mail_to: str = "aryantembhekar294@gmail.com"
    mail_send_confirmation: bool = True

    contact_rate_limit: int = 5
    contact_rate_window_seconds: int = 3600
    max_request_bytes: int = 64_000

    @field_validator("allowed_origins", "allowed_hosts", "app_encryption_keys", mode="before")
    @classmethod
    def split_csv(cls, value: object) -> object:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @model_validator(mode="after")
    def production_safety(self) -> "Settings":
        if self.environment == "production":
            insecure = {
                "jwt_secret": self.jwt_secret == DEV_JWT_SECRET or len(self.jwt_secret) < 40,
                "app_encryption_keys": self.app_encryption_keys == [DEV_ENCRYPTION_KEY],
                "ip_hash_pepper": self.ip_hash_pepper == DEV_IP_PEPPER or len(self.ip_hash_pepper) < 24,
                "admin_password": self.admin_password == "change-me-now" or len(self.admin_password) < 14,
            }
            failed = [name for name, is_insecure in insecure.items() if is_insecure]
            if failed:
                raise ValueError(f"Unsafe production configuration: {', '.join(failed)}")
            if not self.cookie_secure:
                raise ValueError("COOKIE_SECURE must be true in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
