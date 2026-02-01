import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
  BOT_TOKEN = os.getenv("BOT_TOKEN")

  _default_db_path = BASE_DIR / "college_flow.db"
  DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    f"sqlite+aiosqlite:///{_default_db_path}"
  )

  DEV_MODE: bool = str(os.getenv("DEV_MODE", False)).lower() == "true"

settings = Settings()