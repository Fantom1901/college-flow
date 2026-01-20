from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import async_session
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter()

async def get_db():
  async with async_session() as session:
    yield session

@router.post("/me", response_model=UserRead)
async def get_me(tg_id: int, db: AsyncSession = Depends(get_db)):
  stmt = select(User).where(User.tg_id == tg_id)
  result = await db.execute(stmt)
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return user