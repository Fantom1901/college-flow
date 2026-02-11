#!/bin/bash

YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SERVICE=$1
MODE=$2
QUERY=$3

show_help() {
    echo -e "${YELLOW}Использование:${NC}"
    echo "  ./logs.sh [api|bot] all           - Показать всю историю"
    echo "  ./logs.sh [api|bot] live          - Логи в реальном времени"
    echo "  ./logs.sh [api|bot] search [текст] - Поиск по слову"
    echo -e "\n${CYAN}Пример:${NC} ./logs.sh bot search ERROR"
    exit 1
}

if [[ -z "$SERVICE" || -z "$MODE" ]]; then
    show_help
fi

LOG_FILE="logs/$SERVICE.log"

if [[ ! -f "$LOG_FILE" ]]; then
    echo "❌ Файл $LOG_FILE не найден!"
    exit 1
fi

case $MODE in
    all)
        echo -e "${YELLOW}>>> Вся история [$SERVICE]:${NC}"
        cat "$LOG_FILE" | python3 scripts/logs_pretty.py
        ;;
    live)
        echo -e "${YELLOW}>>> Лайв-трансляция [$SERVICE] (Ctrl+C для выхода):${NC}"
        tail -f "$LOG_FILE" | python3 scripts/logs_pretty.py
        ;;
    search)
        if [[ -z "$QUERY" ]]; then
            echo "❌ Введите слово для поиска!"
            exit 1
        fi
        echo -e "${YELLOW}>>> Поиск '$QUERY' в логах [$SERVICE]:${NC}"
        grep -i "$QUERY" "$LOG_FILE" | python3 scripts/logs_pretty.py
        ;;
    *)
        show_help
        ;;
esac