import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.invite import InviteLink
from app.models.role import UserRole

BOT_USERNAME = "duty_master_bot"

async def create_curator_invite_link(session: AsyncSession, creator_id: int) -> str:
  new_invite = InviteLink(
    role=UserRole.CURATOR,
    created_by=creator_id,
    group_id=None,
    student_id=None,
  )

  session.add(new_invite)

  await session.flush()

  invite_link = f"https://{BOT_USERNAME}?start={new_invite.code}"

  await session.commit()
  return invite_link