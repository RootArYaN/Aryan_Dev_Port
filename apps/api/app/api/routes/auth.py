from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select

from app.api.deps import AppSettings, DbSession, csrf_protected, current_admin
from app.core.security import create_access_token, new_csrf_token, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=UserResponse)
async def login(
    payload: LoginRequest, response: Response, db: DbSession, settings: AppSettings
) -> UserResponse:
    user = await db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=user.id, role=user.role, settings=settings)
    csrf = new_csrf_token()
    cookie_options = {
        "secure": settings.cookie_secure,
        "samesite": settings.cookie_samesite,
        "domain": settings.cookie_domain,
        "max_age": settings.access_token_minutes * 60,
        "path": "/",
    }
    response.set_cookie("portfolio_session", token, httponly=True, **cookie_options)
    response.set_cookie("portfolio_csrf", csrf, httponly=False, **cookie_options)
    return UserResponse(email=user.email, name=user.full_name, role=user.role)


@router.get("/me", response_model=UserResponse)
async def me(admin: Annotated[dict[str, str], Depends(current_admin)], db: DbSession) -> UserResponse:
    user = await db.get(User, admin["id"])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return UserResponse(email=user.email, name=user.full_name, role=user.role)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(csrf_protected)])
async def logout(response: Response, settings: AppSettings) -> None:
    options = {"domain": settings.cookie_domain, "path": "/"}
    response.delete_cookie("portfolio_session", **options)
    response.delete_cookie("portfolio_csrf", **options)
