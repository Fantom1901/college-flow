import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
  BOT_TOKEN: str = os.getenv("BOT_TOKEN")

  DB_PATH = BASE_DIR / "college_flow.db"

  DATABASE_URL: str = f"sqlite+aiosqlite:///{DB_PATH}"

  DEV_MODE: bool = os.getenv("DEV_MODE", False).lower() == "true"

settings = Settings()