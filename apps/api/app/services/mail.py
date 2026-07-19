import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.core.config import Settings
from app.db.session import SessionLocal
from app.models.contact import ContactMessage

logger = logging.getLogger(__name__)


class MailService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def notify_contact(
        self, contact_id: str, name: str, email: str, company: str | None, subject: str, message: str
    ) -> None:
        if not self.settings.smtp_host:
            await self._mark(contact_id, "not_configured")
            return
        try:
            await asyncio.to_thread(self._send_sync, name, email, company, subject, message)
            await self._mark(contact_id, "sent")
        except Exception as exc:  # noqa: BLE001
            logger.exception("Contact notification mail failed")
            await self._mark(contact_id, "failed", str(exc)[:500])

    def _send_sync(self, name: str, email: str, company: str | None, subject: str, message: str) -> None:
        mail = EmailMessage()
        mail["From"] = self.settings.mail_from
        mail["To"] = self.settings.mail_to
        mail["Reply-To"] = email
        mail["Subject"] = f"Portfolio enquiry: {subject}"
        company_line = company or "Not provided"
        mail.set_content(f"Name: {name}\nEmail: {email}\nCompany: {company_line}\n\n{message}")

        with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port, timeout=15) as smtp:
            if self.settings.smtp_use_tls:
                smtp.starttls()
            if self.settings.smtp_username:
                smtp.login(self.settings.smtp_username, self.settings.smtp_password)
            smtp.send_message(mail)

    async def _mark(self, contact_id: str, status: str, error: str | None = None) -> None:
        async with SessionLocal() as session:
            contact = await session.get(ContactMessage, contact_id)
            if contact:
                contact.mail_status = status
                contact.mail_error = error
                await session.commit()
