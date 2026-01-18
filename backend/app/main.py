import asyncio
from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.core.middlewares import DbSessionMiddleware
from app.handlers.user import user_router
from app.models import *



async def main():
  from app.core.database import engine
  print(f"DEBUG: Бот подключился к базе по адресу: {engine.url}")
  bot = Bot(token=settings.BOT_TOKEN)
  dp = Dispatcher()

  dp.update.middleware(DbSessionMiddleware())

  dp.include_router(user_router)

  print("Bot started")
  await dp.start_polling(bot)

if __name__ == "__main__":
  asyncio.run(main())