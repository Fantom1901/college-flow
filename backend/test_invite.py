import asyncio
from app.core.database import async_session
from app.services.invite_service import create_invite
from app.models.role import Role
from app.models.user import User
from app.models.invite import InviteLink
from app.models.student import Student
from app.models.group import Group


async def test():
  async with async_session() as session:
    try:

      code = await create_invite(
        session,
        creator_id=1,
        role_id=2,
        group_id=1
      )
      print(f"✅ Инвайт успешно создан!")
      print(f"Код: {code}")
      print(f"Ссылка для бота: https://t.me/твой_бот?start={code}")

    except Exception as e:
      print(f"❌ Ошибка при создании инвайта: {e}")


if __name__ == "__main__":
  asyncio.run(test())