from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.core.database import get_db
from app.models import UserRole
from app.models.curator import Curator
from app.models.student import Student
from app.models.group import Group
from app.models.user import User
from app.models.invite import InviteLink
from app.schemas.group import GroupRead
from app.schemas.invite import GroupInitResponse, GroupInitRequest
from typing import List

router = APIRouter()


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

@router.post("/init", response_model=GroupInitResponse)
async def init_group(
    data: GroupInitRequest,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(InviteLink).where(InviteLink.code == data.invite_code)
    result = await db.execute(stmt)
    invite = result.scalar_one_or_none()

    if not invite or invite.role != UserRole.CURATOR:
        raise HTTPException(status_code=403, detail="Неверный код приглашения")

    try:
        stmt_user = select(User).where(User.tg_id == data.tg_id)
        res_user = await db.execute(stmt_user)
        user = res_user.scalar_one_or_none()

        if not user:
            user = User(
                tg_id=data.tg_id,
                username=data.username,
                role=UserRole.CURATOR,
            )
            db.add(user)
            await db.flush()
        else:
            user.username = data.username
            user.role = UserRole.CURATOR

        new_group = Group(name=data.group_name)
        db.add(new_group)
        await db.flush()

        stmt_curator = select(Curator).where(Curator.user_id == user.id)
        res_curator = await db.execute(stmt_curator)
        curator_profile = res_curator.scalar_one_or_none()

        if not curator_profile:
            curator_profile = Curator(
                user_id=user.id,
                full_name=data.full_name,
            )
            db.add(curator_profile)
        else:
            curator_profile.full_name = data.full_name

        invite.is_used = True
        invite.group_id = new_group.id

        await db.commit()
        return {
            "status": "success",
            "group_id": new_group.id,
            "group_name": new_group.name,
        }

    except Exception as e:
        await db.rollback()
        print(f"DEBUG: Ошибка в init_group: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка базы: {str(e)}")