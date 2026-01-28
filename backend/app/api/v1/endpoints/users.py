from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models import Curator, User, Student, InviteLink
from app.models.role import UserRole
from app.api.v1.dependencies import RoleChecker
from app.schemas.user import UserRead, UserUpdateSchema, StudentRegisterRequest

router = APIRouter()

get_current_user = RoleChecker(allowed_roles=list(UserRole))

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
  return current_user

@router.patch("/me", response_model=UserRead)
async def update_me(
  data: UserUpdateSchema,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  if current_user.role == UserRole.STUDENT:
    stmt = select(Student).where(Student.user_id == current_user.id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if profile:
      profile.full_name = data.full_name

  elif current_user.role == UserRole.CURATOR:
    stmt = select(Curator).where(Curator.user_id  == current_user.id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if profile:
      profile.full_name = data.full_name

  await db.commit()
  await db.refresh(current_user)
  return current_user

@router.post("/register_student")
async def register_student(
  data: StudentRegisterRequest,
  db: AsyncSession = Depends(get_db)
):
  stmt_invite = select(InviteLink).where(
    InviteLink.code == data.invite_code,
    InviteLink.is_used == False
  )
  res_invite = await db.execute(stmt_invite)
  invite = res_invite.scalar_one_or_none()

  if not invite or not invite.student_id:
    raise HTTPException(status_code=404, detail="Инвайт недействителен или не для студента")

  new_user = User(
    tg_id=data.tg_id,
    username=data.username,
    role=UserRole.STUDENT
  )
  db.add(new_user)
  await db.flush()

  stmt_student = select(Student).where(Student.id == invite.student_id)
  res_student = await db.execute(stmt_student)
  student = res_student.scalar_one_or_none()

  if not student:
    await db.rollback()
    raise HTTPException(status_code=404, detail="Профиль студента не найден")

  student.user_id = new_user.id
  invite.is_used = True

  await db.commit()
  return {
    "status": "success",
    "user_id": new_user.id,
  }