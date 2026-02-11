import logging
import sys
from pathlib import Path
from loguru import logger

SLOW_QUERY_THRESHOLD = 0.5


class InterceptHandler(logging.Handler):
  def emit(self, record):
    try:
      level = logger.level(record.levelname).name
    except ValueError:
      level = record.levelno

    frame, depth = sys._getframe(6), 6
    while frame and frame.f_code.co_filename == logging.__file__:
      frame = frame.f_back
      depth += 1

    message = record.getMessage()
    extra = {}

    if "SQL выполнено за" in message:
      try:
        execution_time = float(message.split("за ")[1].replace("s", ""))
        if execution_time > SLOW_QUERY_THRESHOLD:
          level = "WARNING"
          message = f"🐢 МЕДЛЕННЫЙ ЗАПРОС: {message}"
      except Exception:
        pass

    logger.opt(depth=depth, exception=record.exc_info).bind(**extra).log(level, message)


def setup_app_logging(log_name: str):
  log_path = Path("logs") / f"{log_name}.log"

  logging.root.handlers = [InterceptHandler()]
  logging.getLogger("uvicorn").handlers = logging.root.handlers
  logging.getLogger("uvicorn.access").handlers = logging.root.handlers

  logger.remove()

  logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | {message}")

  logger.add(
    log_path,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {message}",
    serialize=True,
    rotation="10 MB",
    compression="zip",
    retention="14 days",
    enqueue=True
  )