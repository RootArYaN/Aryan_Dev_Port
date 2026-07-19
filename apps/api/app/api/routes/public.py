import hashlib

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status
from sqlalchemy import select

from app.api.deps import AppSettings, DbSession
from app.core.encryption import EncryptionService
from app.models.contact import ContactMessage
from app.models.project import Project
from app.schemas.contact import ContactAccepted, ContactCreate
from app.schemas.project import ProjectResponse
from app.services.mail import MailService
from app.services.rate_limit import FixedWindowRateLimiter

router = APIRouter(tags=["public"])
_rate_limiter: FixedWindowRateLimiter | None = None


def get_rate_limiter(settings: AppSettings) -> FixedWindowRateLimiter:
    global _rate_limiter  # noqa: PLW0603
    if _rate_limiter is None:
        _rate_limiter = FixedWindowRateLimiter(
            settings.contact_rate_limit, settings.contact_rate_window_seconds
        )
    return _rate_limiter


@router.get("/projects")
async def projects(db: DbSession) -> list[dict[str, object]]:
    result = await db.scalars(
        select(Project).where(Project.published.is_(True)).order_by(Project.order_index, Project.title)
    )
    return [ProjectResponse.model_validate(item).to_camel() for item in result.all()]


@router.post("/contact", response_model=ContactAccepted, status_code=status.HTTP_202_ACCEPTED)
async def contact(
    payload: ContactCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: DbSession,
    settings: AppSettings,
) -> ContactAccepted:
    if payload.website:
        return ContactAccepted()

    client_ip = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(f"{client_ip}:{settings.ip_hash_pepper}".encode()).hexdigest()
    if not await get_rate_limiter(settings).allow(ip_hash):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many messages. Please try later."
        )

    encryption = EncryptionService(settings.app_encryption_keys)
    item = ContactMessage(
        name_encrypted=encryption.encrypt(payload.name),
        email_encrypted=encryption.encrypt(str(payload.email)),
        company_encrypted=encryption.encrypt(payload.company),
        subject=payload.subject,
        message_encrypted=encryption.encrypt(payload.message),
        ip_hash=ip_hash,
        user_agent=request.headers.get("user-agent", "")[:500],
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)

    background_tasks.add_task(
        MailService(settings).notify_contact,
        item.id,
        payload.name,
        str(payload.email),
        payload.company,
        payload.subject,
        payload.message,
    )
    return ContactAccepted()
