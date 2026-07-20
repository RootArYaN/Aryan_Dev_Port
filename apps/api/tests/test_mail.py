from unittest.mock import AsyncMock, MagicMock, patch

import pytest

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
    assert host_mail.is_multipart()
    host_html = host_mail.get_body(preferencelist=("html",))
    assert host_html is not None
    assert "Reply to Visitor" in host_html.get_content()
    assert "Example Co" in host_html.get_content()
    assert confirmation["To"] == "visitor@example.com"
    assert confirmation["Reply-To"] == "owner@example.com"
    assert confirmation.is_multipart()
    confirmation_html = confirmation.get_body(preferencelist=("html",))
    assert confirmation_html is not None
    assert "Message received" in confirmation_html.get_content()


def test_contact_mail_escapes_visitor_html() -> None:
    settings = Settings(
        environment="test",
        mail_from="portfolio@example.com",
        mail_to="owner@example.com",
    )

    mail = MailService(settings)._host_mail(
        "Visitor",
        "visitor@example.com",
        "<b>Example</b>",
        "Project question",
        "<script>alert('unsafe')</script>",
    )

    html_body = mail.get_body(preferencelist=("html",))
    assert html_body is not None
    html_content = html_body.get_content()
    assert "<script>" not in html_content
    assert "&lt;script&gt;" in html_content
    assert "&lt;b&gt;Example&lt;/b&gt;" in html_content


@pytest.mark.asyncio
async def test_contact_mail_uses_brevo_https_api() -> None:
    settings = Settings(
        environment="test",
        brevo_api_key="test-brevo-key",  # noqa: S106 - test-only API value
        mail_from="portfolio@example.com",
        mail_to="owner@example.com",
        mail_send_confirmation=True,
    )
    response = MagicMock()
    client = AsyncMock()
    client.post.return_value = response
    context = AsyncMock()
    context.__aenter__.return_value = client

    with patch("app.services.mail.httpx.AsyncClient", return_value=context):
        await MailService(settings)._send_brevo(
            "Visitor",
            "visitor@example.com",
            "Example Co",
            "Project question",
            "I would like to discuss a data project.",
        )

    assert client.post.await_count == 2
    host_call, confirmation_call = client.post.await_args_list
    assert host_call.args[0] == "https://api.brevo.com/v3/smtp/email"
    assert host_call.kwargs["headers"]["api-key"] == "test-brevo-key"
    assert host_call.kwargs["json"]["to"][0]["email"] == "owner@example.com"
    assert host_call.kwargs["json"]["replyTo"]["email"] == "visitor@example.com"
    assert confirmation_call.kwargs["json"]["to"][0]["email"] == "visitor@example.com"
    assert response.raise_for_status.call_count == 2
