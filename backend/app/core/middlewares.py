from typing import Any, Awaitable, Callable, Dict
from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from app.core.database import async_session

class DbSessionMiddleware(BaseMiddleware):
  async def __call__(
    self,
    handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
    event: TelegramObject,
    data: Dict[str, Any]
  ) -> Any:
    async with async_session() as session:
      data["session"] = session
      return await handler(event, data)
