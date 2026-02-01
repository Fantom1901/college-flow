from fastapi import FastAPI
from app.api.v1.api import api_router
from contextlib import asynccontextmanager
from app.core.scheduler import start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
  print("🚀 API Nixa Duty запущено и готово к запросам...")
  start_scheduler()
  print("⏰ Планировщик дежурств активирован (проверка по вс в 21:00)")

  yield

  print("🛑 API Nixa Duty остановлено.")


app = FastAPI(
  title="Nixa Duty API",
  description="API для системы дежурств",
  lifespan=lifespan,
  version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")