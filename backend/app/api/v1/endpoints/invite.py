import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.invite_service import get_invite_data
from app.services.student_service import StudentService
from app.core.database import get_db
from app.models.user import User
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
    new_student = await StudentService.create_student(
      session=db,
      group_id=data.group_id,
      full_name=name
    )

    invite_code = str(uuid.uuid4())
    new_invite = InviteLink(
      code=invite_code,
      group_id=data.group_id,
      student_id=new_student.id,
      role=UserRole.STUDENT,
      created_by=current_user.id
    )
    db.add(new_invite)

    result.append({
      "full_name": name,
      "link": f"https://t.me/duty_master_bot?start={invite_code}"
    })

  await db.commit()
  return result

# @router.get("/verify/{code}")
# async def verify_invite(code: str, db: AsyncSession = Depends(get_db)):
#   invite = await get_invite_data(db, code)
#   if not invite or invite.is_used:
#     raise HTTPException(status_code=404, detail="Invite not found or user")
#   return {
#     "role": invite.role,
#     "group_id": invite.group_id,
#     "is_valid": True
#   }








