import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.invite import InviteLink
from sqlalchemy.orm import selectinload
from app.models.user import User

async def create_invite(
  session: AsyncSession,
  creator_id: int,
  role_id: int,
  group_id: int = None,
  student_id: int = None,
) -> str:
  """
  Создаёт инвайт-код в базе и возвращает его.
  :param session:
  :param creator_id:
  :param role_id:
  :param group_id:
  :param student_id:
  :return:
  """

  new_code = str(uuid.uuid4())

  invite = InviteLink(
    code = new_code,
    role_id = role_id,
    group_id = group_id,
    student_id=student_id,
    created_by=creator_id,
    is_used=False
  )

  session.add(invite)
  await session.flush()
  return new_code

async def use_invite(session: AsyncSession, invite: InviteLink, tg_id: int, username: str):
  new_user = User(
    tg_id=tg_id,
    username=username,
    role_id=invite.role_id,
  )
  session.add(new_user)
  await session.flush()

  if invite.student_id:
    from app.models.student import Student
    stmt = select(Student).where(Student.id == invite.student_id)
    result = await session.execute(stmt)
    student = result.scalar_one()
    student.user_id = new_user.id

  invite.is_used = True
  await session.commit()
  return new_user

async def get_invite_data(session: AsyncSession, code: str):
  """
  Проверяет код и возвращает данные инвайта, если он виден
  :param session:
  :param code:
  :return:
  """

  stmt = (
    select(InviteLink)
    .where(InviteLink.code == code, InviteLink.is_used == False)
    .options(selectinload(InviteLink.group))
  )
  result = await session.execute(stmt)
  return result.scalar_one_or_none()