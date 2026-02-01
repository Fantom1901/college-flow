from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy import select
from datetime import date, timedelta, datetime

from app.core.database import async_session
from app.services.duty_service import DutyService
from app.models.duty import DutySetting

scheduler = AsyncIOScheduler()

async def auto_generate_all_groups():
  async with async_session() as session:
    stmt = select(DutySetting.group_id)
    result = await session.execute(stmt)
    group_ids = result.scalars().all()

    next_monday = date.today() + timedelta(days=1)

    for group_id in group_ids:
      try:
        await DutyService.generate_weekly_schedule(session, group_id, next_monday)
        await session.commit()
        print(f"AUTO-GENERATE: Группа {group_id} готова на неделю {next_monday}")
      except Exception as e:
        print(f"AUTO-GENERATE ERROR [Group {group_id}]: {e}")

def start_scheduler():
  scheduler.add_job(
    auto_generate_all_groups,
    CronTrigger(day_of_week='sun', hour=21, minute=0),
    id='weekly_duty_gen',
    replace_existing=True,
  )
  scheduler.add_job(
    auto_generate_all_groups,
    trigger=IntervalTrigger(seconds=60),
    id="test_duty_gen",
    next_run_time=datetime.now(),
    replace_existing=True
  )
  scheduler.start()