from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User
from app.models.invite import InviteLink
from app.models.curator import Curator
from app.models.group import Group
from app.models.role import UserRole
# Импортируй свои Pydantic схемы (измени пути, если они другие)
from app.schemas.groups import GroupInitRequest, GroupInitResponse

router = APIRouter()

@router.post("/init", response_model=GroupInitResponse)
async def init_group(data: GroupInitRequest, db: AsyncSession = Depends(get_db)):
  # 1. Проверяем, существует ли пользователь в таблице users
  user_stmt = select(User).where(User.tg_id == data.tg_id)
  user_res = await db.execute(user_stmt)
  user = user_res.scalar_one_or_none()

  if not user:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Пользователь не найден в системе. Запустите бота."
    )

  # 2. Умный поиск инвайта: если фронт прислал дефолт или пустую строку, ищем инвайт по роли куратора
  invite = None
  if data.invite_code and not data.invite_code.startswith("default_"):
    invite_stmt = select(InviteLink).where(
      InviteLink.code == data.invite_code,
      InviteLink.is_used == False
    )
    invite_res = await db.execute(invite_stmt)
    invite = invite_res.scalar_one_or_none()

  # Если по коду не нашли (или пришел дефолт), ищем любой активный инвайт CURATOR
  if not invite:
    invite_stmt = select(InviteLink).where(
      InviteLink.role == UserRole.CURATOR,
      InviteLink.is_used == False
    )
    invite_res = await db.execute(invite_stmt)
    invite = invite_res.scalar_one_or_none()

  if not invite:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Активный код приглашения для куратора не найден в системе."
    )

  # 3. Проверяем, нет ли уже созданной группы с таким именем
  group_stmt = select(Group).where(Group.name == data.group_name)
  group_res = await db.execute(group_stmt)
  if group_res.scalar_one_or_none():
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Группа с таким названием уже существует."
    )

  try:
    # 4. Создаем группу
    new_group = Group(name=data.group_name)
    db.add(new_group)
    await db.flush()

    # 5. Создаем профиль куратора
    new_curator = Curator(
      user_id=user.id,
      full_name=data.full_name,
      group_id=new_group.id
    )
    db.add(new_curator)

    # 6. Обновляем юзернейм, если он обновился в ТГ, и тушим инвайт
    if data.username:
      user.username = data.username
    invite.is_used = True

    await db.commit()

    return GroupInitResponse(
      group_id=new_group.id,
      group_name=new_group.name
    )

  except Exception as e:
    await db.rollback()
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail=f"Ошибка при инициализации группы: {str(e)}"
    )