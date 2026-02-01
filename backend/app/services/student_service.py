from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.student import Student

class StudentService:
  @staticmethod
  async def get_average_weight(session: AsyncSession, group_id: int) -> int:
    stmt = select(func.avg(Student.weight)).where(Student.group_id == group_id)
    result = await session.execute(stmt)
    avg_weight = result.scalar()

    return int(avg_weight) if avg_weight is not None else 0

  @staticmethod
  async def create_student(session: AsyncSession, group_id: int, full_name: str, user_id: int = None):
    avg_weight = await StudentService.get_average_weight(session, group_id)

    new_student = Student(
      full_name=full_name,
      group_id=group_id,
      user_id=user_id,
      weight=avg_weight
    )
    session.add(new_student)
    await session.flush()
    return new_student