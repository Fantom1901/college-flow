#!/bin/bash

# --- Настройки ---
PROJECT_PATTERN="college_"
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;95m'
NC='\033[0m'

# --- Функции ---
show_help() {
    echo -e "${CYAN}Использование:${NC} ./manage.sh [команда]"
    echo -e "\n${YELLOW}Команды:${NC}"
    echo -e "  start              Запуск в Prod-режиме"
    echo -e "  dev                Запуск локально (FastAPI + БД)"
    echo -e "  test [-v]          Запуск тестов"
    echo -e "  stop               Остановка проекта"
    echo -e "  restart            Пересборка и перезапуск"
    echo -e "  update [branch]    Обновление из Git и перезапуск"
    echo -e "  status             Показать детальное состояние и логи"
}

check_running() {
    docker ps --filter "name=${PROJECT_PATTERN}" --format "{{.Names}}" | grep -q "${PROJECT_PATTERN}"
}

get_python() {
    [ -f "backend/.venv/bin/python" ] && echo "backend/.venv/bin/python" || echo "python3"
}

# --- Логика ---
case "$1" in
    start)
        if check_running; then echo -e "${RED}❌ Проект уже запущен!${NC}"; exit 1; fi
        docker compose up -d
        echo -e "${GREEN}🚀 Проект запущен!${NC}"
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
        echo -e "${GREEN}🔄 Перезапущено с актуальным кодом!${NC}"
        ;;

    update)
        BRANCH=${2:-"develop"}
        echo -e "${MAGENTA}>>> Стягивание обновлений ($BRANCH)...${NC}"
        git pull origin "$BRANCH"
        $0 restart
        ;;

    dev)
        echo -e "${CYAN}>>> Запуск в DEV-РЕЖИМЕ...${NC}"
        docker compose up -d db
        PY=$(get_python)
        cd backend && ../${PY%python}uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
        ;;

    test)
        export PYTHONPATH=$PYTHONPATH:$(pwd)/backend
        $($(get_python)) tests/test_runner.py ${2:-}
        ;;

    status)
        if check_running; then
            echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
            docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

            echo -e "\n${CYAN}📊 ТЕКУЩЕЕ СОСТОЯНИЕ API:${NC}"
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:8000/docs)
            [ "$HTTP_STATUS" == "200" ] && echo -e "${GREEN}✅ API запущено (HTTP 200)${NC}" || echo -e "${RED}⚠️ API не отвечает (Код: $HTTP_STATUS)${NC}"

            echo -e "\n${CYAN}Последние записи логов (LIVE):${NC}"
            echo -e "${YELLOW}--- API ---${NC}"
            docker logs college_api --tail 10 2>&1 | grep -v "/status"
            echo -e "\n${YELLOW}--- BOT ---${NC}"
            docker logs college_bot --tail 5 2>&1
            if docker ps --format '{{.Names}}' | grep -q "college_nginx"; then
                echo -e "\n${YELLOW}--- NGINX ---${NC}"
                docker logs college_nginx --tail 3 2>&1
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