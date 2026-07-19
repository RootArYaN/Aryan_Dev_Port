from cryptography.fernet import Fernet, InvalidToken, MultiFernet


class EncryptionService:
    def __init__(self, keys: list[str]) -> None:
        if not keys:
            raise ValueError("At least one encryption key is required")
        try:
            self._fernet = MultiFernet([Fernet(key.encode()) for key in keys])
        except (ValueError, TypeError) as exc:
            raise ValueError("APP_ENCRYPTION_KEYS must contain valid Fernet keys") from exc

    def encrypt(self, value: str | None) -> str | None:
        if value is None:
            return None
        return self._fernet.encrypt(value.encode()).decode()

    def decrypt(self, value: str | None) -> str | None:
        if value is None:
            return None
        try:
            return self._fernet.decrypt(value.encode()).decode()
        except InvalidToken as exc:
            raise ValueError("Encrypted data could not be decrypted with the configured keys") from exc
