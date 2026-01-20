import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import async_session
from app.models.student import Student
from app.models.invite import InviteLink
from app.schemas.invite import BulkInviteCreate

router = APIRouter()


async def get_db():
  async with async_session() as session:
    yield session


@router.post("/bulk-create")
async def bulk_create_invites(
  data: BulkInviteCreate,
  db: AsyncSession = Depends(get_db)
):
  results = []

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
      student_id=new_student.id,
      role_id=2,
      created_by=1
    )
    db.add(new_invite)

    results.append({
      "full_name": name,
      "link": f"https://t.me/duty_master_bot?start={invite_code}"
    })

  await db.commit()
  return results