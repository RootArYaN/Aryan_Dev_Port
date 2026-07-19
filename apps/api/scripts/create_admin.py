import asyncio

from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.user import User


async def main() -> None:
    settings = get_settings()
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with SessionLocal() as session:
        email = settings.admin_email.lower()
        user = await session.scalar(select(User).where(User.email == email))
        if user:
            user.full_name = settings.admin_name
            user.password_hash = hash_password(settings.admin_password)
            user.is_active = True
            print(f"Updated administrator: {email}")
        else:
            session.add(
                User(
                    email=email,
                    full_name=settings.admin_name,
                    password_hash=hash_password(settings.admin_password),
                )
            )
            print(f"Created administrator: {email}")
        await session.commit()


if __name__ == "__main__":
    asyncio.run(main())
