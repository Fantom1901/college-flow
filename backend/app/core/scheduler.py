from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select
from datetime import date, timedelta
from loguru import logger

from app.core.database import async_session
from app.services.duty_service import DutyService
from app.models.duty import DutySetting

scheduler = AsyncIOScheduler()


async def auto_generate_all_groups():
  with logger.contextualize(scope="SCHEDULER"):
    logger.info("🚀 Запуск автоматической генерации графиков дежурств...")

    async with async_session() as session:
      try:
        stmt = select(DutySetting.group_id)
        result = await session.execute(stmt)
        group_ids = result.scalars().all()

        logger.debug(f"Найдено групп для обработки: {len(group_ids)}")

        next_monday = date.today() + timedelta(days=1)

        for group_id in group_ids:
          try:
            await DutyService.generate_weekly_schedule(session, group_id, next_monday)
            await session.commit()
            logger.success(f"✅ Группа {group_id} готова на неделю {next_monday}")
          except Exception as e:
            logger.exception(f"❌ Ошибка генерации для группы {group_id}: {e}")
            await session.rollback()

        logger.info("🏁 Автоматическая генерация завершена.")

      except Exception as e:
        logger.error(f"🚨 Критическая ошибка планировщика: {e}")


def start_scheduler():
  logger.info("⏰ Инициализация планировщика: воскресенье, 21:00")

  scheduler.add_job(
    auto_generate_all_groups,
    CronTrigger(day_of_week='sun', hour=21, minute=0),
    id='weekly_duty_gen',
    replace_existing=True,
  )

  scheduler.start()
