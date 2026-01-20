from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.orm import joinedload
from app.core.database import async_session
from app.models.student import Student
from app.models.group import Group
from app.schemas.group import GroupRead
from typing import List

router = APIRouter()

async def get_db():
  async with async_session() as session:
    yield session


@router.get("/", response_model=List[GroupRead])
async def get_groups(db: AsyncSession = Depends(get_db)):
  stmt = (
    select(Group)
    .options(
      joinedload(Group.students)
      .joinedload(Student.user)
    )
  )
  result = await db.execute(stmt)

  return result.scalars().unique().all()