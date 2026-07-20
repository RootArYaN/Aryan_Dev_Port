from collections import Counter
from datetime import UTC, date, datetime, time, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select

from app.api.deps import AppSettings, DbSession, csrf_protected, current_admin
from app.core.encryption import EncryptionService
from app.models.contact import ContactMessage
from app.models.project import Project
from app.schemas.contact import ContactAdminResponse
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter(prefix="/admin", tags=["admin"])
Admin = Annotated[dict[str, str], Depends(current_admin)]


def _day_label(day: date) -> str:
    return day.strftime("%a")


@router.get("/metrics")
async def metrics(_: Admin, db: DbSession, settings: AppSettings) -> dict[str, object]:
    now = datetime.now(UTC)
    today_start = datetime.combine(now.date(), time.min, tzinfo=UTC)
    trend_start = today_start - timedelta(days=6)

    total_messages = await db.scalar(select(func.count(ContactMessage.id))) or 0
    recent_timestamps = list(
        await db.scalars(
            select(ContactMessage.created_at).where(ContactMessage.created_at >= trend_start)
        )
    )
    today_messages = sum(timestamp.date() == now.date() for timestamp in recent_timestamps)
    last_seven_days = len(recent_timestamps)

    status_rows = await db.execute(
        select(ContactMessage.mail_status, func.count(ContactMessage.id)).group_by(
            ContactMessage.mail_status
        )
    )
    mail_counts = {str(mail_status): int(count) for mail_status, count in status_rows.all()}

    counts_by_day = Counter(timestamp.date() for timestamp in recent_timestamps)
    trend = []
    for offset in range(7):
        current_day = trend_start.date() + timedelta(days=offset)
        trend.append(
            {
                "date": current_day.isoformat(),
                "label": _day_label(current_day),
                "count": counts_by_day.get(current_day, 0),
            }
        )

    sent = mail_counts.get("sent", 0)
    failed = mail_counts.get("failed", 0)
    attempted = sent + failed

    return {
        "totalMessages": int(total_messages),
        "todayMessages": int(today_messages),
        "lastSevenDays": int(last_seven_days),
        "trend": trend,
        "mail": {
            "configured": bool(settings.smtp_host),
            "recipient": settings.mail_to,
            "sent": sent,
            "failed": failed,
            "pending": mail_counts.get("pending", 0),
            "notConfigured": mail_counts.get("not_configured", 0),
            "deliveryRate": round((sent / attempted) * 100) if attempted else None,
        },
    }


@router.get("/messages")
async def messages(_: Admin, db: DbSession, settings: AppSettings) -> list[dict[str, str | None]]:
    encryption = EncryptionService(settings.app_encryption_keys)
    result = await db.scalars(select(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(100))
    output = []
    for item in result.all():
        response = ContactAdminResponse(
            id=item.id,
            name=encryption.decrypt(item.name_encrypted) or "",
            email=encryption.decrypt(item.email_encrypted) or "",
            company=encryption.decrypt(item.company_encrypted),
            subject=item.subject,
            message=encryption.decrypt(item.message_encrypted) or "",
            mail_status=item.mail_status,
            created_at=item.created_at.isoformat(),
        )
        output.append(response.to_camel())
    return output


@router.get("/projects")
async def all_projects(_: Admin, db: DbSession) -> list[dict[str, object]]:
    result = await db.scalars(select(Project).order_by(Project.order_index, Project.title))
    return [ProjectResponse.model_validate(item).to_camel() for item in result.all()]


@router.post("/projects", status_code=status.HTTP_201_CREATED, dependencies=[Depends(csrf_protected)])
async def create_project(_: Admin, payload: ProjectCreate, db: DbSession) -> dict[str, object]:
    if await db.scalar(select(Project.id).where(Project.slug == payload.slug)):
        raise HTTPException(status_code=409, detail="Project slug already exists")
    item = Project(**payload.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return ProjectResponse.model_validate(item).to_camel()


@router.put("/projects/{project_id}", dependencies=[Depends(csrf_protected)])
async def update_project(
    project_id: str, _: Admin, payload: ProjectUpdate, db: DbSession
) -> dict[str, object]:
    item = await db.get(Project, project_id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    await db.commit()
    await db.refresh(item)
    return ProjectResponse.model_validate(item).to_camel()


@router.delete(
    "/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(csrf_protected)]
)
async def delete_project(project_id: str, _: Admin, db: DbSession) -> None:
    item = await db.get(Project, project_id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(item)
    await db.commit()
