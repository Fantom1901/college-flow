import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.database import Base, get_db
from app.main import app


@pytest_asyncio.fixture(scope="function")
async def db_session():
  engine = create_async_engine("sqlite+aiosqlite:///:memory:")
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)

  session_factory = async_sessionmaker(engine, expire_on_commit=False)
  async with session_factory() as session:
    yield session
  await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def client(db_session):
  async def override_get_db():
    yield db_session

  app.dependency_overrides[get_db] = override_get_db
  from httpx import AsyncClient, ASGITransport
  async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
    yield ac
  app.dependency_overrides.clear()