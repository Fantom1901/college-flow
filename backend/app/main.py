import asyncio
from fastapi import FastAPI
from app.api.v1.api import api_router
from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.core.middlewares import DbSessionMiddleware
from app.handlers.user import user_router
from app.models import *

app = FastAPI(
  title="Nixa Duty API",
  description="API для системы дежурств",
  version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")

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
  import uvicorn
  uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
  asyncio.run(main())