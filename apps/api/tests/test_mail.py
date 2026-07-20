from unittest.mock import MagicMock, patch

from app.core.config import Settings
from app.services.mail import MailService


def test_contact_mail_sends_host_alert_and_client_confirmation() -> None:
    settings = Settings(
        environment="test",
        smtp_host="smtp.example.com",
        smtp_username="mailer",
        smtp_password="secret",  # noqa: S106 - test-only SMTP value
        mail_from="portfolio@example.com",
        mail_to="owner@example.com",
        mail_send_confirmation=True,
    )
    smtp = MagicMock()
    smtp.__enter__.return_value = smtp

    with patch("app.services.mail.smtplib.SMTP", return_value=smtp):
        MailService(settings)._send_sync(
            "Visitor",
            "visitor@example.com",
            "Example Co",
            "Project question",
            "I would like to discuss a data project.",
        )

    assert smtp.starttls.call_count == 1
    smtp.login.assert_called_once_with("mailer", "secret")
    assert smtp.send_message.call_count == 2
    host_mail, confirmation = [call.args[0] for call in smtp.send_message.call_args_list]
    assert host_mail["To"] == "owner@example.com"
    assert host_mail["Reply-To"] == "visitor@example.com"
    assert confirmation["To"] == "visitor@example.com"
    assert confirmation["Reply-To"] == "owner@example.com"
