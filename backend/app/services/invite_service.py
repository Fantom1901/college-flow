import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
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

async def get_invite_data(session: AsyncSession, code: str):
  """Получает данные инвайта по UUID коду"""
  stmt = select(InviteLink).where(InviteLink.code == code)
  result = await session.execute(stmt)
  return result.scalar_one_or_none()


async def use_invite(session: AsyncSession, code: str):
  """Помечает инвайт как использованный"""
  invite = await get_invite_data(session, code)
  if invite:
    invite.is_used = True
    await session.commit()
    return True
  return False