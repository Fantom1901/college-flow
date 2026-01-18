import asyncio
from sqlalchemy import select
from app.core.database import async_session
from app.models.role import Role
from app.models.student import Student
from app.models.user import User
from app.models.group import Group

async def seed_roles():
  async with async_session() as session:
    try:
      res_role = await session.execute(select(Role))
      roles = res_role.scalars().all()
      if not roles:
        print("База пуста. Добавляю новые роли...")
        roles = [
          Role(name="admin"),
          Role(name="student"),
          Role(name="teacher"),
        ]
        session.add_all(roles)
        await session.flush()

      group_name = "ИСИП 24-01-1"
      res_group = await session.execute(select(Group).where(Group.name == group_name))
      group = res_group.scalar_one_or_none()

      if not group:
        print(f"Создаю группу {group_name}...")
        group = Group(name=group_name)
        session.add(group)
        await session.flush()

      username = "Nixa"
      res_user = await session.execute(select(User).where(User.username == username))
      user = res_user.scalar_one_or_none()

      if not user:
        print(f"Создаю пользователя {username}...")
        res_admin = await session.execute(select(Role).where(Role.name == "admin"))
        admin_role = res_admin.scalar_one()
        user = User(
          tg_id=12345678,
          username=username,
          role_id=admin_role.id,
        )
        session.add(user)
        await session.flush()

        print(f"Привязываю Nixa к группе {group_name}...")
        student_profile = Student(
          user_id=user.id,
          group_id=group.id,
        )
        session.add(student_profile)

      await session.commit()
      print("Данные успешно обновлены!")

    except Exception as e:
      await session.rollback()
      print(f"ПРОИЗОЩЛА ОШИБКАЖ {e}")
      raise e

if __name__ == '__main__':
  asyncio.run(seed_roles())