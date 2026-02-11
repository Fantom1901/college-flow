#!/bin/bash

# Настройки проекта
PROJECT_PATTERN="college_"
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;95m'
NC='\033[0m'

check_running() {
    # Ищем запущенные контейнеры по паттерну
    RUNNING_CONTAINERS=$(docker ps --filter "name=${PROJECT_PATTERN}" --format "{{.Names}}")
    if [ ! -z "$RUNNING_CONTAINERS" ]; then
        return 0
    else
        return 1
    fi
}

case $1 in
    start)
        echo -e "${YELLOW}>>> Проверка безопасности...${NC}"
        if check_running; then
            echo -e "${RED}❌ ОШИБКА: Проект уже запущен!${NC}"
            exit 1
        fi
        docker-compose up -d
        echo -e "${GREEN}🚀 Проект запущен!${NC}"
        ;;

    stop)
        echo -e "${YELLOW}>>> Останавливаю проект...${NC}"
        docker-compose down
        echo -e "${GREEN}🛑 Все службы остановлены.${NC}"
        ;;

    restart)
        $0 stop
        docker-compose up -d --build
        echo -e "${GREEN}🔄 Перезапущено!${NC}"
        ;;

    status)
        if check_running; then
            echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
            docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

            echo -e "\n${CYAN}📊 ТЕКУЩЕЕ СОСТОЯНИЕ СЕРВЕРА (LIVE):${NC}"
            STATS=$(curl -s --max-time 2 http://localhost:8000/status)

            if [[ "$STATS" == *"cpu"* ]]; then
                CPU=$(echo $STATS | python3 -c "import sys, json; print(json.load(sys.stdin)['cpu'])")
                RAM=$(echo $STATS | python3 -c "import sys, json; print(json.load(sys.stdin)['ram'])")
                DISK=$(echo $STATS | python3 -c "import sys, json; print(json.load(sys.stdin)['disk'])")
                echo -e "${YELLOW}CPU:${NC} ${CPU}%  ${YELLOW}RAM:${NC} ${RAM}%  ${YELLOW}DISK:${NC} ${DISK}%"
            else
                echo -e "${RED}⚠️ API не отвечает (статистика недоступна)${NC}"
            fi

            echo -e "\n${CYAN}Последние записи логов (LIVE):${NC}"

            echo -e "${YELLOW}--- API ---${NC}"
            # Убираем спам от curl-запросов и проверяем на JSON
            API_RAW=$(docker logs college_api --tail 15 2>&1 | grep -v "/status" | tail -n 3)
            if [[ "$API_RAW" == *"{"* ]]; then
                echo "$API_RAW" | python3 scripts/logs_pretty.py
            else
                echo -e "${API_RAW:-'Логи API пусты или содержат только техническую информацию'}"
            fi

            echo -e "${YELLOW}--- BOT ---${NC}"
            # Бот обычно шлет JSON через Loguru
            BOT_RAW=$(docker logs college_bot --tail 3 2>&1)
            if [[ "$BOT_RAW" == *"{"* ]]; then
                echo "$BOT_RAW" | python3 scripts/logs_pretty.py
            else
                echo -e "${BOT_RAW:-'Логи бота пусты'}"
            fi
        else
            echo -e "${RED}○ ПРОЕКТ ОСТАНОВЛЕН${NC}"
        fi
        ;;

    *)
        echo "Использование: ./manage.sh {start|stop|restart|status}"
        exit 1
        ;;
esac