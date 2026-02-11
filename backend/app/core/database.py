import time
from typing import AsyncGenerator

from sqlalchemy import event
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from loguru import logger

from app.core.config import settings

engine = create_async_engine(
  settings.DATABASE_URL,
  pool_recycle=1800,
  pool_pre_ping=True,
  echo=False,
  pool_size=10,
  max_overflow=20,
)

async_session = async_sessionmaker(
  engine,
  expire_on_commit=False,
  class_=AsyncSession
)


class Base(DeclarativeBase):
  pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
  async with async_session() as session:
    try:
      yield session
    except Exception as e:
      logger.exception(f"❌ Ошибка сессии базы данных: {e}")
      await session.rollback()
      raise
    finally:
      await session.close()


@event.listens_for(engine.sync_engine, "before_cursor_execute")
def before_cursor_execute(conn, cursor, statement, parameters, context, execmany):
  context._query_start_time = time.perf_counter()


@event.listens_for(engine.sync_engine, "after_cursor_execute")
def after_cursor_execute(conn, cursor, statement, parameters, context, execmany):
  duration = time.perf_counter() - context._query_start_time

  if duration > 0.5:
    logger.warning(
      f"⚠️ МЕДЛЕННЫЙ ЗАПРОС: {duration:.4f}s\n"
      f"SQL: {statement}\n"
      f"Параметры: {parameters}"
    )
  else:
    logger.debug(f"SQL выполнено за {duration:.4f}s")