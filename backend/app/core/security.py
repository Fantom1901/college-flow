import hmac
import hashlib
import json
from urllib.parse import parse_qsl, unquote
from app.core.config import settings

def verify_telegram_data(init_data: str) -> dict | None:
  """
  Проверяет подпись данных Telegram Mini App.
  В DEV_MODE позволяет прокидывать просто tg_id для тестов
  :param init_data:
  :return:
  """
  if settings.DEV_MODE and init_data.isdigit():
    return {
      "id": int(init_data),
      "first_name": "Dev",
      "last_name": "User",
      "username": "dev_user",
      "language_code": "ru",
    }

  if not settings.BOT_TOKEN:
    return None

  try:
    if "%22" in init_data or "%7B" in init_data:
      init_data = unquote(init_data)

    vals = dict(parse_qsl(init_data))

    hash_to_check = vals.pop("hash", None)
    if not hash_to_check:
      return None

    data_check_string  = "\n".join(
      f"{k}={v}" for k, v in sorted(vals.items())
    )

    secret_key = hmac.new(
      key=b"WebAppData",
      msg=settings.BOT_TOKEN.encode(),
      digestmod=hashlib.sha256
    ).digest()

    calculated_hash = hmac.new(
      key=secret_key,
      msg=data_check_string.encode(),
      digestmod=hashlib.sha256
    ).hexdigest()

    if calculated_hash != hash_to_check:
      return None

    user_data = json.loads(vals.get("user", "{}"))
    return user_data

  except Exception:
    return None