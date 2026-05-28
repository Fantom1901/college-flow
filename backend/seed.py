from sqlalchemy import delete
from app.models import User, Student, Group, DutySchedule, DutyStatus
from app.models.role import UserRole
from datetime import date

async def seed_data(session):
    # Очищаем базу, чтобы избежать ошибок Unique Violation
    await session.execute(delete(DutySchedule))
    await session.execute(delete(Student))
    await session.execute(delete(User))
    await session.execute(delete(Group))
    await session.commit()

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

    # 4. Расписание дежурств
    duty1 = DutySchedule(group_id=group.id, student_id=student1.id, date=date(2026, 5, 30), status=DutyStatus.PENDING)
    duty2 = DutySchedule(group_id=group.id, student_id=student2.id, date=date(2026, 6, 1), status=DutyStatus.PENDING)
    session.add_all([duty1, duty2])

    await session.commit()
    print("✅ База наполнена для теста обмена!")

    # ВОЗВРАЩАЕМ РЕАЛЬНЫЕ ID ИЗ БАЗЫ
    return {
      "init_student_id": student1.id,
      "sugg_student_id": student2.id,
      "init_duty_id": duty1.id,
      "sugg_duty_id": duty2.id
    }