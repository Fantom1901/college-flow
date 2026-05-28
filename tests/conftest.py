import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.database import Base, get_db
from app.main import app

# Создаем глобальный тестовый движок (один на весь запуск тестов)
test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
TestingSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup_test_db():
  # Перед каждым тестом создаем таблицы с нуля
  async with test_engine.begin() as conn:
    await conn.run_sync(Base.metadata.drop_all)
    await conn.run_sync(Base.metadata.create_all)
  yield
  # После теста можно ничего не делать, drop_all вызовется в начале следующего


@pytest_asyncio.fixture(scope="function")
async def db_session():
  # Фикстура сессии для самого файла тестов (чтобы сетапить seed_data)
  async with TestingSessionLocal() as session:
    yield session


@pytest_asyncio.fixture(scope="function")
async def client():
  # Переопределяем get_db так, чтобы FastAPI создавал сессии из ТОГО ЖЕ движка в памяти
  async def override_get_db():
    async with TestingSessionLocal() as session:
      yield session

  app.dependency_overrides[get_db] = override_get_db

  from httpx import AsyncClient, ASGITransport
  async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test", follow_redirects=True) as ac:
    yield ac

  app.dependency_overrides.clear()