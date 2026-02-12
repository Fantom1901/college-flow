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
        echo -e "${MAGENTA}>>> Стягивание обновлений из Git...${NC}"
        git pull origin develop
        $0 restart
        ;;

    status)
        if check_running; then
            echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
            docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

            echo -e "\n${CYAN}📊 ТЕКУЩЕЕ СОСТОЯНИЕ API:${NC}"
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:8000/docs)

            if [ "$HTTP_STATUS" == "200" ]; then
                echo -e "${GREEN}✅ API запущено и отвечает (HTTP 200 на /docs)${NC}"
            else
                echo -e "${RED}⚠️ API не отвечает (Код: $HTTP_STATUS)${NC}"
            fi

            echo -e "\n${CYAN}Последние записи логов (LIVE):${NC}"

            echo -e "${YELLOW}--- API ---${NC}"
            API_RAW=$(docker logs college_api --tail 10 2>&1 | grep -v "/status")
            echo -e "$API_RAW"

            echo -e "\n${YELLOW}--- BOT ---${NC}"
            BOT_RAW=$(docker logs college_bot --tail 5 2>&1)
            echo -e "$BOT_RAW"

            if docker ps --format '{{.Names}}' | grep -q "college_nginx"; then
                echo -e "\n${YELLOW}--- NGINX ---${NC}"
                docker logs college_nginx --tail 3 2>&1
            fi
        else
            echo -e "${RED}○ ПРОЕКТ ОСТАНОВЛЕН${NC}"
        fi
        ;;

    *)
        echo -e "${YELLOW}Использование: $0 {start|stop|restart|status|update}${NC}"
        exit 1
        ;;
esac