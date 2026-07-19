import base64
import os
import secrets

print(f"JWT_SECRET={secrets.token_urlsafe(48)}")
print(f"APP_ENCRYPTION_KEYS={base64.urlsafe_b64encode(os.urandom(32)).decode()}")
print(f"IP_HASH_PEPPER={secrets.token_urlsafe(32)}")
