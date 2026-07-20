import asyncio
import logging
import smtplib
from email.message import EmailMessage
from email.utils import formataddr, parseaddr
from html import escape
from urllib.parse import quote

import httpx

from app.core.config import Settings
from app.db.session import SessionLocal
from app.models.contact import ContactMessage

logger = logging.getLogger(__name__)
BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email"


def _one_line(value: str) -> str:
    return " ".join(value.splitlines()).strip()


def _message_html(value: str) -> str:
    return escape(value.strip()).replace("\n", "<br>")


def _email_shell(*, preheader: str, eyebrow: str, title: str, content: str, footer: str) -> str:
    return f"""\
<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f4f1;color:#171918;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">{escape(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f1;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
            <tr>
              <td style="padding:0 2px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="color:#171918;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Aryan Tembhekar</td>
                    <td align="right" style="color:#8a8f8b;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;">Portfolio</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #e3e3de;background:#ffffff;padding:48px 44px;">
                <div style="color:#66706a;font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">{escape(eyebrow)}</div>
                <h1 style="margin:14px 0 0;color:#171918;font-size:30px;font-weight:500;line-height:1.25;letter-spacing:-0.7px;">{escape(title)}</h1>
                {content}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 4px 0;color:#929691;font-size:10px;line-height:1.6;">{escape(footer)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


class MailService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _sender(self) -> tuple[str, str]:
        configured_name, configured_email = parseaddr(self.settings.mail_from)
        sender_email = configured_email or self.settings.mail_from.strip()
        sender_name = configured_name or self.settings.admin_name
        if not sender_email or "@" not in sender_email:
            raise ValueError("MAIL_FROM must contain a valid Brevo-verified sender email address")
        return sender_name, sender_email

    async def notify_contact(
        self, contact_id: str, name: str, email: str, company: str | None, subject: str, message: str
    ) -> None:
        if not self.settings.brevo_api_key and not self.settings.smtp_host:
            await self._mark(contact_id, "not_configured")
            return
        try:
            if self.settings.brevo_api_key:
                await self._send_brevo(name, email, company, subject, message)
            else:
                await asyncio.to_thread(self._send_sync, name, email, company, subject, message)
            await self._mark(contact_id, "sent")
        except Exception as exc:  # noqa: BLE001
            logger.exception("Contact notification mail failed")
            await self._mark(contact_id, "failed", str(exc)[:500])

    def _host_mail(
        self, name: str, email: str, company: str | None, subject: str, message: str
    ) -> EmailMessage:
        safe_name = _one_line(name)
        safe_email = _one_line(email)
        safe_subject = _one_line(subject)
        safe_company = _one_line(company) if company else "Not provided"
        reply_href = f"mailto:{escape(safe_email, quote=True)}?subject={quote(f'Re: {safe_subject}')}"

        mail = EmailMessage()
        mail["From"] = formataddr(self._sender())
        mail["To"] = self.settings.mail_to
        mail["Reply-To"] = safe_email
        mail["Subject"] = f"[Portfolio] {safe_subject} — {safe_name}"
        mail.set_content(
            "New portfolio enquiry\n\n"
            f"Subject: {safe_subject}\n"
            f"Name: {safe_name}\n"
            f"Email: {safe_email}\n"
            f"Company: {safe_company}\n\n"
            f"{message.strip()}\n\n"
            "Reply directly to this email to respond to the visitor."
        )

        content = f"""
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:32px;border-top:1px solid #e8e8e3;">
                  <tr>
                    <td style="padding:14px 12px 14px 0;border-bottom:1px solid #eeeeea;color:#8a8f8b;font-size:11px;">From</td>
                    <td style="padding:14px 0;border-bottom:1px solid #eeeeea;color:#202321;font-size:13px;font-weight:700;">{escape(safe_name)}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 12px 14px 0;border-bottom:1px solid #eeeeea;color:#8a8f8b;font-size:11px;">Email</td>
                    <td style="padding:14px 0;border-bottom:1px solid #eeeeea;color:#356c65;font-size:13px;">{escape(safe_email)}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 12px 14px 0;border-bottom:1px solid #eeeeea;color:#8a8f8b;font-size:11px;">Company</td>
                    <td style="padding:14px 0;border-bottom:1px solid #eeeeea;color:#202321;font-size:13px;">{escape(safe_company)}</td>
                  </tr>
                </table>
                <div style="margin-top:28px;color:#8a8f8b;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Message</div>
                <div style="margin-top:12px;color:#343936;font-size:15px;line-height:1.75;">{_message_html(message)}</div>
                <div style="margin-top:30px;border-top:1px solid #e8e8e3;padding-top:20px;">
                  <a href="{reply_href}" style="color:#255e57;font-size:13px;font-weight:700;text-decoration:none;">Reply to {escape(safe_name)} &nbsp;→</a>
                </div>
        """
        mail.add_alternative(
            _email_shell(
                preheader=f"New enquiry from {safe_name}: {safe_subject}",
                eyebrow="New portfolio enquiry",
                title=safe_subject,
                content=content,
                footer="Sent securely from your portfolio contact form.",
            ),
            subtype="html",
        )
        return mail

    def _confirmation_mail(self, name: str, email: str, subject: str) -> EmailMessage:
        safe_name = _one_line(name)
        safe_email = _one_line(email)
        safe_subject = _one_line(subject)
        first_name = safe_name.split()[0] if safe_name else "there"
        follow_up_href = (
            f"mailto:{escape(self.settings.mail_to, quote=True)}"
            f"?subject={quote(f'Follow-up: {safe_subject}')}"
        )

        mail = EmailMessage()
        mail["From"] = formataddr(self._sender())
        mail["To"] = safe_email
        mail["Reply-To"] = self.settings.mail_to
        mail["Subject"] = f"Message received — {self.settings.admin_name}"
        mail.set_content(
            f"Hi {first_name},\n\n"
            "Thanks for reaching out. Your message is safely in my inbox. "
            "I will review it and reply directly to this email.\n\n"
            f"Subject: {safe_subject}\n\n"
            "If you need to add anything, reply to this message.\n\n"
            f"— {self.settings.admin_name}"
        )

        content = f"""
                <p style="margin:22px 0 0;color:#4f5551;font-size:15px;line-height:1.75;">Thanks for reaching out. Your message is in my inbox. I’ll review it and reply directly to this email.</p>
                <div style="margin-top:28px;border-top:1px solid #e8e8e3;border-bottom:1px solid #e8e8e3;padding:18px 0;">
                  <div style="color:#8a8f8b;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Your subject</div>
                  <div style="margin-top:8px;color:#202321;font-size:14px;font-weight:700;">{escape(safe_subject)}</div>
                  <div style="margin-top:10px;color:#356c65;font-size:11px;">Received ✓</div>
                </div>
                <p style="margin:22px 0 0;color:#777d79;font-size:13px;line-height:1.7;">If you need to add a detail, reply to this message and it will stay with your original enquiry.</p>
                <a href="{follow_up_href}" style="display:inline-block;margin-top:18px;color:#255e57;font-size:13px;font-weight:700;text-decoration:none;">Add more context &nbsp;→</a>
        """
        mail.add_alternative(
            _email_shell(
                preheader=f"Thanks {first_name}, your message has been received.",
                eyebrow="Message received",
                title=f"Thanks, {first_name}.",
                content=content,
                footer=f"You received this because you contacted {self.settings.admin_name} through the portfolio website.",
            ),
            subtype="html",
        )
        return mail

    def _send_sync(self, name: str, email: str, company: str | None, subject: str, message: str) -> None:
        host_mail = self._host_mail(name, email, company, subject, message)
        confirmation = self._confirmation_mail(name, email, subject)

        with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port, timeout=15) as smtp:
            if self.settings.smtp_use_tls:
                smtp.starttls()
            if self.settings.smtp_username:
                smtp.login(self.settings.smtp_username, self.settings.smtp_password)
            smtp.send_message(host_mail)
            if self.settings.mail_send_confirmation:
                smtp.send_message(confirmation)

    @staticmethod
    def _brevo_payload(mail: EmailMessage) -> dict[str, object]:
        sender_name, sender_email = parseaddr(str(mail["From"]))
        recipient_name, recipient_email = parseaddr(str(mail["To"]))
        reply_name, reply_email = parseaddr(str(mail["Reply-To"]))
        plain = mail.get_body(preferencelist=("plain",))
        html = mail.get_body(preferencelist=("html",))

        payload: dict[str, object] = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": recipient_email, "name": recipient_name or recipient_email}],
            "subject": str(mail["Subject"]),
            "textContent": plain.get_content() if plain else "",
            "htmlContent": html.get_content() if html else "",
        }
        if reply_email:
            payload["replyTo"] = {"email": reply_email, "name": reply_name or reply_email}
        return payload

    async def _send_brevo(
        self, name: str, email: str, company: str | None, subject: str, message: str
    ) -> None:
        messages = [self._host_mail(name, email, company, subject, message)]
        if self.settings.mail_send_confirmation:
            messages.append(self._confirmation_mail(name, email, subject))

        headers = {
            "accept": "application/json",
            "api-key": self.settings.brevo_api_key,
            "content-type": "application/json",
        }
        async with httpx.AsyncClient(timeout=15) as client:
            for mail in messages:
                response = await client.post(
                    BREVO_EMAIL_URL,
                    headers=headers,
                    json=self._brevo_payload(mail),
                )
                try:
                    response.raise_for_status()
                except httpx.HTTPStatusError as exc:
                    detail = response.text.strip()[:500] or "No response details"
                    raise RuntimeError(
                        f"Brevo rejected the email with HTTP {response.status_code}: {detail}"
                    ) from exc

    async def _mark(self, contact_id: str, status: str, error: str | None = None) -> None:
        async with SessionLocal() as session:
            contact = await session.get(ContactMessage, contact_id)
            if contact:
                contact.mail_status = status
                contact.mail_error = error
                await session.commit()
