import sys
import os
sys.path.append(os.getcwd())

import asyncio
from fastapi import FastAPI
from app.api.v1.api import api_router
from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.core.middlewares import DbSessionMiddleware
from app.handlers.user import user_router
from app.models import *

bot_task = None

async def lifespan(app: FastAPI):
  bot = Bot(token=settings.BOT_TOKEN)
  dp = Dispatcher()
  dp.update.middleware(DbSessionMiddleware())
  dp.include_router(user_router)

  global bot_task
  bot_task = asyncio.create_task(dp.start_polling(bot))
  print("Bot and API started")

  yield

  if bot_task:
    bot_task.cancel()
    try:
      await bot_task
    except asyncio.CancelledError:
      print("Bot stopped")

app = FastAPI(
  title="Nixa Duty API",
  description="API для системы дежурств",
  lifespan=lifespan,
  version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
  import uvicorn
  uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)