#!/bin/bash

# Ждем, пока база данных станет доступна
echo "⏳ Ожидание запуска базы данных (db:5432)..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "✅ База данных доступна!"

# Если передан аргумент запуска сервера, делаем миграции
if [[ "$*" == *"uvicorn"* ]]; then
    echo "🚀 Запуск миграций Alembic..."
    alembic upgrade head
fi

# Выполняем команду, переданную из docker-compose
exec "$@"