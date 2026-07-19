from app.core.config import Settings
from app.core.encryption import EncryptionService
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password


def test_password_hash_round_trip() -> None:
    hashed = hash_password("a-strong-password")
    assert hashed != "a-strong-password"
    assert verify_password("a-strong-password", hashed)
    assert not verify_password("wrong-password", hashed)


def test_encryption_round_trip() -> None:
    settings = Settings(environment="test")
    service = EncryptionService(settings.app_encryption_keys)
    encrypted = service.encrypt("private message")
    assert encrypted != "private message"
    assert service.decrypt(encrypted) == "private message"


def test_access_token_round_trip() -> None:
    settings = Settings(environment="test")
    token = create_access_token(subject="user-1", role="admin", settings=settings)
    payload = decode_access_token(token, settings)
    assert payload["sub"] == "user-1"
    assert payload["role"] == "admin"
