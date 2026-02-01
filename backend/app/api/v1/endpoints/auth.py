from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import verify_telegram_data
from app.models.user import User

router = APIRouter()

@router.post("/verify")
async def verify_session(
  x_tg_data: str = Header(alias="X-TG-Data"),
  db: AsyncSession = Depends(get_db),
):
  tg_user_data = verify_telegram_data(x_tg_data)
  if not tg_user_data:
    raise HTTPException(
      status_code=401,
      detail="Invalid Telegram data signature",
    )

  tg_id = tg_user_data.get("id")
  stmt = select(User).where(User.tg_id == tg_id)
  result = await db.execute(stmt)
  user = result.scalar_one_or_none()

  if not user:
    return {
      "status": "unauthorized",
      "tg_id": tg_id,
      "message": "User not found",
    }

  return {
    "status": "ok",
    "user_id": user.id,
    "role": user.role,
    "username": user.username,
  }