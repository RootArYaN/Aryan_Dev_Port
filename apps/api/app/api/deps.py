from typing import Annotated

from fastapi import Cookie, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.security import csrf_tokens_match, decode_access_token
from app.db.session import get_db

DbSession = Annotated[AsyncSession, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]


async def current_admin(
    settings: AppSettings,
    portfolio_session: Annotated[str | None, Cookie()] = None,
) -> dict[str, str]:
    if not portfolio_session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    payload = decode_access_token(portfolio_session, settings)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator access required")
    return {"id": str(payload["sub"]), "role": str(payload["role"])}


async def csrf_protected(
    _: Annotated[dict[str, str], Depends(current_admin)],
    portfolio_csrf: Annotated[str | None, Cookie()] = None,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    if not csrf_tokens_match(portfolio_csrf, x_csrf_token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF verification failed")
