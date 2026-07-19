from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ContactMessage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "contact_messages"

    name_encrypted: Mapped[str] = mapped_column(Text, nullable=False)
    email_encrypted: Mapped[str] = mapped_column(Text, nullable=False)
    company_encrypted: Mapped[str | None] = mapped_column(Text)
    subject: Mapped[str] = mapped_column(String(140), nullable=False)
    message_encrypted: Mapped[str] = mapped_column(Text, nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_agent: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    mail_status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    mail_error: Mapped[str | None] = mapped_column(String(500))
