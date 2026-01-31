import asyncio
import uuid
from sqlalchemy import select
from app.core.database import async_session
from app.models import User, Student, Group, Curator, InviteLink
from app.models.role import UserRole

async def seed_data():
    # Используем async_session() как контекст-менеджер
    async with async_session() as session:
        # 1. Группа
        group = Group(name="ИСП-401")
        session.add(group)
        await session.flush()

        # 2. Куратор
        curator_user = User(
            tg_id=123456789,
            username="cool_curator",
            role=UserRole.CURATOR
        )
        session.add(curator_user)
        await session.flush()

        curator_profile = Curator(
            user_id=curator_user.id,
            full_name="Александр Сергеевич Пушкин"
        )
        session.add(curator_profile)

        # 3. Студент
        student_user = User(
            tg_id=987654321,
            username="student_hero",
            role=UserRole.STUDENT
        )
        session.add(student_user)
        await session.flush()

        student_profile = Student(
            user_id=student_user.id,
            group_id=group.id,
            full_name="Иван Иванович Иванов",
            weight=1.0
        )
        session.add(student_profile)
        await session.flush()

        # 4. Инвайт
        invite = InviteLink(
            code=str(uuid.uuid4())[:8],
            role=UserRole.STUDENT,
            student_id=student_profile.id,
            is_used=False
        )
        session.add(invite)

        await session.commit()
        print("✅ Всё четко! База наполнена.")

if __name__ == "__main__":
    asyncio.run(seed_data())