import asyncio
from fastapi import FastAPI
from app.api.v1.api import api_router
from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.core.middlewares import DbSessionMiddleware
from app.handlers.user import user_router
# Не импортируй всё через *, лучше импортировать то, что нужно,
# но для инициализации моделей оставим пока так
from app.models import *

bot_task = None


async def lifespan(app: FastAPI):
  bot = Bot(token=settings.BOT_TOKEN)
  dp = Dispatcher()

  dp.update.middleware(DbSessionMiddleware())
  dp.include_router(user_router)

  print("🚀 Запуск: Бот и API готовятся к работе...")

  global bot_task
  bot_task = asyncio.create_task(dp.start_polling(bot))

  yield

  print("🛑 Остановка: Завершаю работу бота...")
  if bot_task:
    bot_task.cancel()
    try:
      await bot_task
    except asyncio.CancelledError:
      pass

  await bot.session.close()
  print("✅ Все системы остановлены.")


app = FastAPI(
  title="Nixa Duty API",
  description="API для системы дежурств",
  lifespan=lifespan,
  version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")
