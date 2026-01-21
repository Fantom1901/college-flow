from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.duty import DutySetting, DutyMechanism
from app.models.student import Student

class DutyService:

  @staticmethod
  async def init_group_settings(session: AsyncSession, group_id: int):
    new_setting = DutySetting(
      group_id = group_id,
      mechanism=DutyMechanism.WEIGHTED,
      work_days=[0, 1, 2, 3, 4],
      excluded_dates=[]
    )
    session.add(new_setting)
    return new_setting

  @staticmethod
  async def get_or_create_settings(session: AsyncSession, group_id: int) -> DutySetting:
    stmt = select(DutySetting).where(DutySetting.group_id == group_id)
    result = await session.execute(stmt)
    setting = result.scalar_one_or_none()

    if not setting:
      setting = DutySetting(
        group_id = group_id,
        mechanism=DutyMechanism.WEIGHTED,
        work_days=[0, 1, 2, 3, 4]
      )
      session.add(setting)
      await session.commit()
      await session.refresh(setting)

    return setting

  @staticmethod
  async def get_next_duty_student(session: AsyncSession, group_id: int):
    settings = await DutyService.get_or_create_settings(session, group_id)

    if settings.mechanism == DutyMechanism.WEIGHTED:
      stmt = (
        select(Student)
        .where(Student.group_id == group_id)
        .order_by(Student.weight.asc(), Student.full_name.asc())
        .limit(1)
      )
    else:
      stmt = select(Student).where(Student.group_id == group_id).order_by(Student.full_name.asc())

    result = await session.execute(stmt)
    return result.scalar_one_or_none()