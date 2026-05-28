import asyncio
from dotenv import load_dotenv
from loguru import logger
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from app.core.config import settings
from app.core.logger import setup_app_logging as setup_logging
from bot.handlers import start, exchange

load_dotenv()

async def main():
  setup_logging("bot")

  bot = Bot(
    token=settings.BOT_TOKEN,
    default_properties=DefaultBotProperties(parse_mode=ParseMode.HTML)
  )
  dp = Dispatcher()
  dp.include_router(start.router)
  dp.include_router(exchange.router)
  logger.info("🤖 Бот College Flow запускается...")

  try:
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)
  except Exception as e:
    logger.critical(f"💥 Бот прекратил работу из-за ошибки: {e}")
  finally:
    logger.warning("Shutting down bot...")
    await bot.session.close()


if __name__ == "__main__":
  try:
    asyncio.run(main())
  except (KeyboardInterrupt, SystemExit):
    logger.info("Бот остановлен вручную")