from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload
from app.api.v1.dependencies import RoleChecker
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

get_current_user = RoleChecker(allowed_roles=list(UserRole))


@router.get("/my", response_model=GroupRead)
async def get_my_groups(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  group_id = None

  if current_user.role == UserRole.STUDENT and current_user.student_profile:
    group_id = current_user.student_profile.group_id

  elif current_user.role == UserRole.CURATOR and current_user.curator_profile:
    stmt_group = select(Group).where(Group.curator_id == current_user.curator_profile.id)
    group_res = await db.execute(stmt_group)
    group_obj = group_res.scalar_one_or_none()

    if group_obj:
      group_id = group_obj.id

  if not group_id:
    raise HTTPException(
      status_code=404,
      detail="Вы не привязаны к группе. Обратитесь к куратору"
    )

  stmt = (
    select(Group)
    .where(Group.id == group_id)
    .options(
      selectinload(Group.students).joinedload(Student.user)
    )
  )

  result = await db.execute(stmt)
  group = result.scalars().unique().one_or_none()

  if not group:
    raise HTTPException(
      status_code=404,
      detail="Запись о группе не найдена"
    )

  if group and group.students:
    group.students.sort(key=lambda x: x.full_name)

  return group

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

  # ДОБАВЛЯЕМ ПРОВЕРКУ: если инвайта нет, роль не та ИЛИ ОН УЖЕ ИСПОЛЬЗОВАН
  if not invite or invite.role != UserRole.CURATOR or invite.is_used:
    raise HTTPException(status_code=403, detail="Код приглашения недействителен или уже использован")

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
      await db.flush()
    else:
      curator_profile.full_name = data.full_name
      await db.flush()

    new_group = Group(
      name=data.group_name,
      curator_id=curator_profile.id,
    )
    db.add(new_group)
    await db.flush()

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
