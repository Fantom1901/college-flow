import uuid
import time

from fastapi import Request
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware

class LoggingMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next):
    request_id = str(uuid.uuid4())

    with logger.contextualize(scope=f"API:{request_id}"):
      start_time = time.perf_counter()

      logger.info(f"Начало запроса: {request.method} {request.url.path}")

      try:
        response = await call_next(request)

        process_time = time.perf_counter() - start_time

        response.headers["X-Request-Id"] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"

        logger.info(f"Завершено: {response.status_code} | Время: {process_time:.4f}s")
        return response

      except Exception as e:
        process_time = time.perf_counter() - start_time
        logger.exception(f"❌ Ошибка запроса после {process_time:.4f}s: {e}")
        raise