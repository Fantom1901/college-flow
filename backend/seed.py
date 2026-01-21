import asyncio
from sqlalchemy import select
from app.core.database import async_session
from app.models.user import User, UserRole
from app.models.group import Group
from app.models.student import Student


async def seed_data():
  async with async_session() as session:
    try:
      # 1. Твой профиль (Admin)
      nixa_tg_id = 12345678  # Твой реальный ID
      res_nixa = await session.execute(select(User).where(User.tg_id == nixa_tg_id))
      nixa = res_nixa.scalar_one_or_none()

      if not nixa:
        print(f"Создаю SuperAdmin: Nixa...")
        nixa = User(
          tg_id=nixa_tg_id,
          username="Nixa",
          role=UserRole.ADMIN
        )
        session.add(nixa)
      else:
        nixa.role = UserRole.ADMIN  # На всякий случай обновляем роль
        print("Админ Nixa уже существует.")

      # 2. Тестовый Куратор (для проверки прав доступа)
      curator_tg_id = 987654321  # Просто рандомный ID
      res_curator = await session.execute(select(User).where(User.tg_id == curator_tg_id))
      curator = res_curator.scalar_one_or_none()

      if not curator:
        print("Создаю тестового куратора...")
        curator = User(
          tg_id=curator_tg_id,
          username="test_curator",
          role=UserRole.CURATOR
        )
        session.add(curator)

      # 3. Группа
      group_name = "ИСИП 24-01-1"
      res_group = await session.execute(select(Group).where(Group.name == group_name))
      group = res_group.scalar_one_or_none()

      if not group:
        print(f"Создаю группу {group_name}...")
        group = Group(name=group_name)
        session.add(group)
        await session.flush()  # Получаем ID группы для студента

        # Привязываем тебя как студента (чтобы у админа был профиль студента)
        student_profile = Student(
          user_id=nixa.id if nixa.id else None,  # Если nixa уже был в базе, id есть
          group_id=group.id,
          full_name="Тимофей Никса"
        )
        session.add(student_profile)

      await session.commit()
      print("✅ База успешно подготовлена!")

    except Exception as e:
      await session.rollback()
      print(f"❌ ОШИБКА ПРИ СИДЕ: {e}")
      raise e


if __name__ == '__main__':
  asyncio.run(seed_data())
