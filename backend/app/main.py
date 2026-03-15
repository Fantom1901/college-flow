import psutil
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.scheduler import start_scheduler

from app.core.logger import logger
from app.api.v1.api import api_router


def get_system_status():
    return {
        "cpu": psutil.cpu_percent(interval=0.1),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent
    }


async def monitor_resources():
    psutil.cpu_percent(interval=None)

    while True:
        try:
            stats = get_system_status()
            logger.info(
                f"📊 СТАТУС СИСТЕМЫ: CPU: {stats['cpu']}% | "
                f"RAM: {stats['ram']}% | DISK: {stats['disk']}%"
            )

            if stats['ram'] > 90 or stats['cpu'] > 90:
                logger.warning("🚨 РЕСУРСЫ НА ПРЕДЕЛЕ!")

        except Exception as e:
            logger.error(f"❌ Ошибка мониторинга: {e}")

        await asyncio.sleep(1800)


@asynccontextmanager
async def lifespan(app: FastAPI):
  logger.info("🚀 API Nixa Duty запущено...")

  try:
    start_scheduler()
  except Exception as e:
    logger.error(f"🛠 Ошибка при запуске планировщика: {e}")

  monitor_task = asyncio.create_task(monitor_resources())

  yield

  # Логика при выключении
  monitor_task.cancel()
  # Если хочешь корректно останавливать планировщик:
  # from app.services.scheduler import scheduler
  # scheduler.shutdown()

  try:
    await monitor_task
  except asyncio.CancelledError:
    logger.info("📡 Фоновая задача мониторинга остановлена.")

  logger.info("🛑 API остановлено.")


app = FastAPI(
    title="Nixa Duty API",
    lifespan=lifespan
)

# --- НАСТРОЙКА CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://dezhur-app.ru",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------------

app.include_router(api_router, prefix="/api/v1")


@app.get("/status")
async def status_endpoint():
    return get_system_status()


@app.get("/")
async def root():
    return {"message": "Nixa Duty API is running", "version": "1.0.0"}