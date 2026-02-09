FROM python:3.11-slim

# Устанавливаем netcat для проверки доступности базы
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Даем права на скрипт запуска
RUN chmod +x /app/entrypoint.sh

ENV PYTHONPATH=/app

# Скрипт сам решит, что запускать, на основе команды из compose
ENTRYPOINT ["/app/entrypoint.sh"]