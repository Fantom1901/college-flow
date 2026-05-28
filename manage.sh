#!/bin/bash

# --- Настройки ---
PROJECT_PATTERN="college_"
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;95m'
NC='\033[0m'

# --- Хелперы ---
show_help() {
    echo -e "${CYAN}Использование:${NC} ./manage.sh [команда] [аргументы]"
    echo -e "\n${YELLOW}Команды:${NC}"
    echo -e "  start              Запустить проект в Docker"
    echo -e "  dev                Запуск локально (FastAPI + БД)"
    echo -e "  test [-v]          Запуск тестов"
    echo -e "  stop               Остановить проект"
    echo -e "  restart            Пересобрать и перезапустить"
    echo -e "  update [branch]    Обновить код из Git"
    echo -e "  status             Показать состояние"
}

check_running() {
    docker ps --filter "name=${PROJECT_PATTERN}" --format "{{.Names}}" | grep -q "${PROJECT_PATTERN}"
}

find_python_exec() {
    for path in "backend/.venv/bin/python" "backend/venv/bin/python" ".venv/bin/python"; do
        if [ -f "$path" ]; then echo "$path"; return; fi
    done
    echo "python3" # Fallback
}

# --- Логика команд ---
case "$1" in
    start)
        if check_running; then echo -e "${RED}❌ Проект уже запущен!${NC}"; exit 1; fi
        docker compose up -d
        echo -e "${GREEN}🚀 Проект запущен!${NC}"
        ;;

    stop)
        echo -e "${YELLOW}>>> Остановка проекта...${NC}"
        docker compose down
        echo -e "${GREEN}🛑 Остановлено.${NC}"
        ;;

    restart)
        $0 stop && docker compose up -d --build
        echo -e "${GREEN}🔄 Перезапущено!${NC}"
        ;;

    dev)
        echo -e "${CYAN}>>> Запуск в DEV-РЕЖИМЕ...${NC}"
        docker compose up -d db
        PY=$(find_python_exec)
        UVICORN=${PY%python}uvicorn
        cd backend && ../$UVICORN app.main:app --host 0.0.0.0 --port 8000 --reload
        ;;

    test)
        export PYTHONPATH=$PYTHONPATH:$(pwd)/backend
        PY=$(find_python_exec)
        $PY tests/test_runner.py ${2:-}
        ;;

    update)
        BRANCH=${2:-"develop"}
        echo -e "${MAGENTA}>>> Обновление ветки ${BRANCH}...${NC}"
        git pull origin "$BRANCH" && $0 restart
        ;;

    status)
        if check_running; then
            echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
            docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
            # Проверка API
            if curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:8000/docs | grep -q "200"; then
                echo -e "${GREEN}✅ API отвечает (200)${NC}"
            else
                echo -e "${RED}⚠️ API недоступен${NC}"
            fi
        else
            echo -e "${RED}○ ПРОЕКТ ОСТАНОВЛЕН${NC}"
        fi
        ;;

    *)
        show_help
        exit 1
        ;;
esac