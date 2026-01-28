from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

engine = create_async_engine(
  settings.DATABASE_URL,
  echo=True,
  pool_size=10,
  max_overflow=20,
)

async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

async def get_db():
  async with async_session() as session:
    try:
      yield session
    finally:
      await session.close()

class Base(DeclarativeBase):
    pass