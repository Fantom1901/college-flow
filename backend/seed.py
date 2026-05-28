import asyncio
import uuid
from datetime import date
from sqlalchemy import select
from app.core.database import async_session
from app.models import User, Student, Group, DutySchedule, DutyStatus
from app.models.role import UserRole


async def seed_data():
  async with async_session() as session:
    # 1. Группа
    group = Group(name="ИСП-401")
    session.add(group)
    await session.flush()

    # 2. Студент №1 (Инициатор)
    user1 = User(tg_id=111111111, username="nixa_user", role=UserRole.STUDENT)
    session.add(user1)
    await session.flush()
    student1 = Student(user_id=user1.id, group_id=group.id, full_name="Никса Тимофей")
    session.add(student1)

    # 3. Студент №2 (Оппонент)
    user2 = User(tg_id=222222222, username="other_student", role=UserRole.STUDENT)
    session.add(user2)
    await session.flush()
    student2 = Student(user_id=user2.id, group_id=group.id, full_name="Иван Иванов")
    session.add(student2)
    await session.flush()

    # 4. Расписание дежурств (создаем 2 записи)
    duty1 = DutySchedule(group_id=group.id, student_id=student1.id, date=date(2026, 5, 30), status=DutyStatus.PENDING)
    duty2 = DutySchedule(group_id=group.id, student_id=student2.id, date=date(2026, 6, 1), status=DutyStatus.PENDING)
    session.add_all([duty1, duty2])

    await session.commit()
    print("✅ База наполнена для теста обмена!")
    print(f"Студент 1 (Никса) ID: {student1.id}")
    print(f"Студент 2 (Иван) ID: {student2.id}")
    print(f"Дежурство 1 ID: {duty1.id} (Дата: 2026-05-30)")
    print(f"Дежурство 2 ID: {duty2.id} (Дата: 2026-06-01)")


if __name__ == "__main__":
  asyncio.run(seed_data())