from fastapi import FastAPI
from app.api.v1.api import api_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Здесь можно инициализировать пул соединений БД, если нужно
    print("🚀 API Nixa Duty запущено и готово к запросам...")
    yield
    print("🛑 API Nixa Duty остановлено.")

app = FastAPI(
    title="Nixa Duty API",
    description="API для системы дежурств",
    lifespan=lifespan,
    version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")