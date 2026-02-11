import json
import sys

RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
MAGENTA = "\033[95m"
RESET = "\033[0m"


def main():
  HIDE_CONFLICTS = True

  try:
    for line in sys.stdin:
      try:
        log_data = json.loads(line)
        record = log_data["record"]

        msg = record["message"]

        if HIDE_CONFLICTS and "TelegramConflictError" in msg:
          continue

        time = record["time"]["repr"][:19]
        level_name = record["level"]["name"]
        scope = record.get("extra", {}).get("scope", "GLOBAL")

        color = RESET
        if level_name == "ERROR":
          color = RED
        elif level_name == "WARNING":
          color = YELLOW
        elif level_name == "SUCCESS":
          color = GREEN
        elif level_name == "INFO":
          color = CYAN

        print(f"{color}[{time}] {level_name: <7}{RESET} | {MAGENTA}{scope: <12}{RESET} | {msg}")
      except Exception:
        continue
  except KeyboardInterrupt:
    print(f"\n{YELLOW}🛑 Просмотр логов остановлен.{RESET}")
    sys.exit(0)

if __name__ == "__main__":
  main()