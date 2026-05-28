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

case $1 in
    -h|--help)
        show_help
        exit 0
        ;;

    start)
        echo -e "${YELLOW}>>> Проверка безопасности...${NC}"
        if check_running; then
            echo -e "${RED}❌ ОШИБКА: Проект уже запущен!${NC}"
            exit 1
        fi
        docker compose up -d
        echo -e "${GREEN}🚀 Проект запущен в Prod-режиме!${NC}"
        ;;

    dev)
        echo -e "${CYAN}>>> Запуск в DEV-РЕЖИМЕ...${NC}"
        docker compose up -d db postgres 2>/dev/null || docker compose up -d
        activate_venv
        cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
        ;;

    test)
        shift
        PYTHON_EXEC="./.venv/bin/python"
        if [ ! -f "$PYTHON_EXEC" ]; then
            echo -e "${RED}❌ Интерпретатор не найден. Проверь .venv${NC}"
            exit 1
        fi
        echo -e "${CYAN}>>> Запуск набора тестов...${NC}"
        $PYTHON_EXEC tests/test_runner.py "$@"
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}✅ Все тесты пройдены!${NC}"
        else
            echo -e "\n${RED}❌ Ошибки в тестах!${NC}"
            exit 1
        fi
        ;;

    stop)
        echo -e "${YELLOW}>>> Останавливаю проект...${NC}"
        docker compose down
        echo -e "${GREEN}🛑 Все службы остановлены.${NC}"
        ;;

    restart)
        echo -e "${MAGENTA}>>> Пересборка и перезапуск...${NC}"
        $0 stop
        docker compose up -d --build
        echo -e "${GREEN}🔄 Перезапущено!${NC}"
        ;;

    update)
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
        ;;

    status)
        if check_running || lsof -i :8000 >/dev/null; then
            echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
            docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        else
            echo -e "${RED}○ ПРОЕКТ ОСТАНОВЛЕН${NC}"
        fi
        ;;

    *)
        echo -e "${RED}Неизвестная команда: $1${NC}"
        show_help
        exit 1
        ;;
esac