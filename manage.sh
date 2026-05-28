#!/bin/bash

# Настройки проекта
PROJECT_PATTERN="college_"
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;95m'
NC='\033[0m'

show_help() {
    echo -e "${CYAN}Использование:${NC} ./manage.sh [команда] [аргументы]"
    echo -e "\n${YELLOW}Команды:${NC}"
    echo -e "  start              Запустить проект в Docker (Prod-режим)"
    echo -e "  dev                Запустить локально (FastAPI + БД)"
    echo -e "  test [-v]          Запустить тесты (опционально: -v для полной инфы)"
    echo -e "  stop               Остановить все контейнеры"
    echo -e "  restart            Пересобрать и перезапустить контейнеры"
    echo -e "  update [branch]    Обновить код из Git"
    echo -e "  status             Показать состояние проекта"
    echo -e "\n${YELLOW}Опции:${NC}"
    echo -e "  -h, --help         Показать эту справку"
}

activate_venv() {
    if [ -d "backend/.venv" ]; then
        source backend/.venv/bin/activate
    elif [ -d "backend/venv" ]; then
        source backend/venv/bin/activate
    fi
}

check_running() {
    RUNNING_CONTAINERS=$(docker ps --filter "name=${PROJECT_PATTERN}" --format "{{.Names}}")
    [ ! -z "$RUNNING_CONTAINERS" ]
}

# Тримминг аргумента (вырезаем скрытый мусор, невидимые пробелы и спецсимволы)
CMD=$(echo "$1" | tr -d '[:space:]')

if [ -z "$CMD" ] || [ "$CMD" == "-h" ] || [ "$CMD" == "--help" ]; then
    show_help
    exit 0

elif [ "$CMD" == "start" ]; then
    echo -e "${YELLOW}>>> Проверка безопасности...${NC}"
    if check_running; then
        echo -e "${RED}❌ ОШИБКА: Проект уже запущен!${NC}"
        exit 1
    fi
    docker compose up -d
    echo -e "${GREEN}🚀 Проект запущен в Prod-режиме!${NC}"

elif [ "$CMD" == "dev" ]; then
    echo -e "${CYAN}>>> Запуск в DEV-РЕЖИМЕ...${NC}"
    # Запускаем только базу данных из docker-compose
    docker compose up -d db postgres 2>/dev/null || docker compose up -d

    # Определяем правильный путь к uvicorn
    if [ -f "backend/.venv/bin/uvicorn" ]; then
        UVICORN_EXEC="backend/.venv/bin/uvicorn"
    elif [ -f "backend/venv/bin/uvicorn" ]; then
        UVICORN_EXEC="backend/venv/bin/uvicorn"
    elif [ -f ".venv/bin/uvicorn" ]; then
        UVICORN_EXEC=".venv/bin/uvicorn"
    else
        echo -e "${RED}❌ ОШИБКА: Виртуальное окружение или uvicorn не найдены!${NC}"
        exit 1
    fi

    # Переходим в backend и запускаем uvicorn
    cd backend && ../$UVICORN_EXEC app.main:app --host 0.0.0.0 --port 8000 --reload

elif [ "$CMD" == "test" ]; then
    echo -e "${CYAN}>>> Запуск тестов через test_runner.py...${NC}"

    # Определяем правильный путь к python из виртуального окружения
    if [ -f "backend/.venv/bin/python" ]; then
        PYTHON_EXEC="backend/.venv/bin/python"
    elif [ -f "backend/venv/bin/python" ]; then
        PYTHON_EXEC="backend/venv/bin/python"
    elif [ -f ".venv/bin/python" ]; then
        PYTHON_EXEC=".venv/bin/python"
    else
        # Если venv не нашли, пробуем глобальный, но предупреждаем
        echo -e "${YELLOW}⚠️ Предупреждение: Виртуальное окружение не найдено, использую системный python...${NC}"
        PYTHON_EXEC="python"
    fi

    # Добавляем корень проекта в PYTHONPATH, чтобы тесты видели папку app
    export PYTHONPATH=$PYTHONPATH:$(pwd)/backend

    # Запускаем тесты через правильный питон
    if [ "$2" == "-v" ]; then
        $PYTHON_EXEC tests/test_runner.py -v
    else
        $PYTHON_EXEC tests/test_runner.py
    fi

elif [ "$CMD" == "stop" ]; then
    echo -e "${YELLOW}>>> Останавливаю проект...${NC}"
    docker compose down
    echo -e "${GREEN}🛑 Все службы остановлены.${NC}"

elif [ "$CMD" == "restart" ]; then
    echo -e "${MAGENTA}>>> Пересборка и перезапуск...${NC}"
    $0 stop
    docker compose up -d --build
    echo -e "${GREEN}🔄 Перезапущено!${NC}"

elif [ "$CMD" == "update" ]; then
    echo -e "${CYAN}>>> Синхронизация с GitHub...${NC}"
    BRANCH=$2
    [ -z "$BRANCH" ] && { echo -ne "${MAGENTA}Ветка: ${NC}"; read BRANCH; [ -z "$BRANCH" ] && BRANCH="feature/frontend"; }
    git fetch origin "$BRANCH"
    git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH" "origin/$BRANCH"
    if [[ "$(git pull origin "$BRANCH")" == *"Already up to date."* ]]; then
        echo -e "${GREEN}✅ Код актуален.${NC}"
    else
        $0 restart
    fi

elif [ "$CMD" == "status" ]; then
    if check_running || lsof -i :8000 >/dev/null; then
        echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
        docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        echo -e "${RED}○ ПРОЕКТ ОСТАНОВЛЕН${NC}"
    fi

else
    echo -e "${RED}Неизвестная команда: '$1'${NC}"
    show_help
    exit 1
fi