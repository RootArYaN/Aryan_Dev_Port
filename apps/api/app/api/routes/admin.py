from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.api.deps import AppSettings, DbSession, csrf_protected, current_admin
from app.core.encryption import EncryptionService
from app.models.contact import ContactMessage
from app.models.project import Project
from app.schemas.contact import ContactAdminResponse
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter(prefix="/admin", tags=["admin"])
Admin = Annotated[dict[str, str], Depends(current_admin)]


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
