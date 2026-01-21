from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.core.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.role import UserRole
from app.models.invite import InviteLink
from app.schemas.invite import CuratorInviteResponse, BulkInviteCreate, BulkInviteResponse
from app.api.v1.dependencies import RoleChecker

router = APIRouter()

admin_only = RoleChecker(allowed_roles=[UserRole.ADMIN])

staff_only = RoleChecker(allowed_roles=[UserRole.ADMIN, UserRole.LEADER, UserRole.CURATOR])

@router.post("/create-curator-link", response_model=CuratorInviteResponse)
async def create_curator_link(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(admin_only),
):

  new_invite = InviteLink(
    role=UserRole.CURATOR,
    created_by=current_user.id,
    group_id=None,
    student_id=None
  )
  db.add(new_invite)
  await db.flush()

  invite_link = f"https://t.me/duty_master_bot?start={new_invite.code}"
  await db.commit()

  return {"link": invite_link}

@router.post("/bulk-create", response_model=List[BulkInviteResponse])
async def create_bulk_invite(
  data: BulkInviteCreate,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(staff_only),
):
  result = []

  for name in data.names:
    new_student = Student(
      full_name=name,
      group_id=data.group_id
    )
    db.add(new_student)
    await db.flush()

    invite_code = str(uuid.uuid4())
    new_invite = InviteLink(
      code=invite_code,
      group_id=data.group_id,
      role=UserRole.STUDENT,
      created_by=current_user.id,
    )
    db.add(new_invite)

    result.append({
      "full_name": name,
      "link": f"https://t.me/duty_master_bot?start={invite_code}",
    })

  await db.commit()
  return result










