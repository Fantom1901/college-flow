import psutil
import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.logger import logger


def get_system_status():
  return {
    "cpu": psutil.cpu_percent(),
    "ram": psutil.virtual_memory().percent,
    "disk": psutil.disk_usage('/').percent
  }


async def monitor_resources():
  while True:
    stats = get_system_status()
    logger.info(f"📊 СТАТУС СИСТЕМЫ: CPU: {stats['cpu']}% | RAM: {stats['ram']}% | DISK: {stats['disk']}%")

    if stats['ram'] > 90 or stats['cpu'] > 90:
      logger.warning("🚨 РЕСУРСЫ НА ПРЕДЕЛЕ!")

    await asyncio.sleep(1800)


@asynccontextmanager
async def lifespan(app: FastAPI):
  logger.info("🚀 API Nixa Duty запущено...")
  monitor_task = asyncio.create_task(monitor_resources())
  yield
  monitor_task.cancel()
  logger.info("🛑 API остановлено.")


app = FastAPI(lifespan=lifespan)


# Эндпоинт для нашего manage.sh
@app.get("/status")
async def status_endpoint():
  return get_system_status()