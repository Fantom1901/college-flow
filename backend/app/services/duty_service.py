from datetime import date, timedelta
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.student import Student
from app.models.duty import DutySchedule, DutyStatus, DutySetting, DutyMechanism


class DutyService:
  @staticmethod
  async def get_or_create_settings(session: AsyncSession, group_id: int) -> DutySetting:
    stmt = select(DutySetting).where(DutySetting.group_id == group_id)
    result = await session.execute(stmt)
    setting = result.scalar_one_or_none()

    if not setting:
      setting = DutySetting(group_id=group_id)
      session.add(setting)
      await session.flush()
    return setting

  @staticmethod
  async def generate_weekly_schedule(session: AsyncSession, group_id: int, start_from: date):
    settings: DutySetting = await DutyService.get_or_create_settings(session, group_id)

    end_date = start_from + timedelta(days=7)
    delete_stmt = delete(DutySchedule).where(
      DutySchedule.group_id == group_id,
      DutySchedule.date >= start_from,
      DutySchedule.date < end_date,
      DutySchedule.status == DutyStatus.PENDING
    )
    await session.execute(delete_stmt)

    stmt = select(Student).where(
      Student.group_id == group_id,
      Student.is_active == True
    )

    if settings.mechanism == DutyMechanism.WEIGHTED:
      stmt = stmt.order_by(
        Student.weight.asc(),
        Student.last_duty_date.asc().nullsfirst(),
        Student.full_name.asc()
      )
    else:
      stmt = stmt.order_by(
        Student.last_duty_date.asc().nullsfirst(),
        Student.full_name.asc()
      )

    result = await session.execute(stmt)
    candidates = result.scalars().all()

    if not candidates:
      return

    current_date = start_from
    candidate_idx = 0
    num_candidates = len(candidates)

    for _ in range(7):
      if (current_date.weekday() in settings.work_days and
        current_date.isoformat() not in settings.excluded_dates):

        check_stmt = select(DutySchedule).where(
          DutySchedule.group_id == group_id,
          DutySchedule.date == current_date
        )
        res = await session.execute(check_stmt)
        existing_count = len(res.scalars().all())

        for _ in range(max(0, settings.person_per_day - existing_count)):
          student = candidates[candidate_idx % num_candidates]

          new_duty = DutySchedule(
            group_id=group_id,
            student_id=student.id,
            date=current_date,
            status=DutyStatus.PENDING
          )
          session.add(new_duty)

          candidate_idx += 1

      current_date += timedelta(days=1)

    settings.last_generated_until = current_date - timedelta(days=1)
    await session.flush()

  @staticmethod
  async def set_duty_result(session: AsyncSession, duty_id: int, status: DutyStatus):
    stmt = (
      select(DutySchedule)
      .where(DutySchedule.id == duty_id)
      .options(selectinload(DutySchedule.student))
    )
    res = await session.execute(stmt)
    duty = res.scalar_one_or_none()

    if not duty:
      return

    if status == DutyStatus.DONE:
      duty.student.weight += 1
      duty.student.last_duty_date = duty.date

    duty.status = status
    await session.flush()