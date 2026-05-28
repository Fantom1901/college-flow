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
        echo -e "${GREEN}🚀 Проект запущен в Prod-режиме!${NC}"
        ;;

    dev)
        echo -e "${CYAN}>>> Запуск в DEV-РЕЖИМЕ (Локально + Hot Reload)...${NC}"

        # 1. Поднимаем только базу данных из docker-compose, чтобы бэк мог к ней зацепиться
        echo -e "${YELLOW}➔ Запускаю базу данных в Docker...${NC}"
        docker compose up -d db postgres 2>/dev/null || docker compose up -d

        # 2. Активируем виртуальное окружение и запускаем FastAPI через uvicorn локально
        if [ -d "backend/.venv" ]; then
            source backend/.venv/bin/activate
        elif [ -d "backend/venv" ]; then
            source backend/venv/bin/activate
        fi

        echo -e "${GREEN}🚀 Стартую FastAPI локально на порту 8000 с авто-перезапуском...${NC}"
        cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
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
        echo -e "${CYAN}>>> Синхронизация с GitHub...${NC}"

        # Берем ветку из аргумента $2 (от вебхука) или спрашиваем
        BRANCH=$2

        if [ -z "$BRANCH" ]; then
            echo -e "${YELLOW}Доступные ветки в репозитории:${NC}"
            git fetch --all --prune > /dev/null
            git branch -r | grep "origin/" | sed 's/  origin\///' | grep -v "HEAD"

            echo -ne "\n${MAGENTA}Какую ветку стянуть? (по умолчанию feature/frontend): ${NC}"
            read BRANCH
            [ -z "$BRANCH" ] && BRANCH="feature/frontend"
        else
            # Если ветка пришла извне, убираем префикс refs/heads/, если он вдруг остался
            BRANCH=${BRANCH#refs/heads/}
            echo -e "${GREEN}>>> Автоматическое обновление ветки: $BRANCH${NC}"
        fi

        echo -e "${CYAN}>>> Переключение на $BRANCH и стягивание изменений...${NC}"

        # Синхронизация
        git fetch origin "$BRANCH"

        # Проверка локальной ветки
        if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
            git checkout "$BRANCH"
        else
            git checkout -b "$BRANCH" "origin/$BRANCH"
        fi

        # Пытаемся стянуть
        PULL_OUTPUT=$(git pull origin "$BRANCH" 2>&1)

        if [[ "$PULL_OUTPUT" == *"Already up to date."* ]]; then
            echo -e "${GREEN}✅ Код уже актуален. Перезапуск не требуется.${NC}"
        elif [[ "$PULL_OUTPUT" == *"error"* || "$PULL_OUTPUT" == *"fatal"* ]]; then
            echo -e "${RED}❌ ОШИБКА при git pull:${NC}"
            echo "$PULL_OUTPUT"
            exit 1
        else
            echo -e "${GREEN}✅ Изменения получены. Обновляю контейнеры...${NC}"
            # Вызываем restart напрямую через скрипт
            $0 restart
        fi
        ;;

    status)
        if check_running || lsof -i :8000 >/dev/null; then
            echo -e "${GREEN}● ПРОЕКТ АКТИВЕН${NC}"
            [ ! -z "$RUNNING_CONTAINERS" ] && docker ps --filter "name=${PROJECT_PATTERN}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

            echo -e "\n${CYAN}📊 ТЕКУЩЕЕ СОСТОЯНИЕ API:${NC}"
            HTTP_STATUS=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 2 -L http://localhost/docs)

            if [ "$HTTP_STATUS" == "200" ]; then
                echo -e "${GREEN}✅ API запущено локально и отвечает (HTTP 200 на /docs)${NC}"
            else
                echo -e "${RED}⚠️ API не отвечает (Код: $HTTP_STATUS)${NC}"
            fi
        else
            echo -e "${RED}○ ПРОЕКТ ОСТАНОВЛЕН${NC}"
        fi
        ;;

    *)
        echo -e "${YELLOW}Использование: $0 {start|dev|stop|restart|status|update}${NC}"
        exit 1
        ;;
esac