import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()
from aiogram import Bot, Dispatcher
from app.core.config import settings
from bot.handlers import start
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

logging.basicConfig(level=logging.INFO)


async def main():
  bot = Bot(token=settings.BOT_TOKEN, default_properties=DefaultBotProperties(parse_mode=ParseMode.HTML))
  dp = Dispatcher()

  dp.include_router(start.router)

  logging.info("Starting bot...")
  try:
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)
  finally:
    await bot.session.close()


if __name__ == "__main__":
  asyncio.run(main())
