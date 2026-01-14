# ⚡ Nixa Duty | Frontend Technical Specification v1.0

## 1. Назначение документа

Frontend Technical Specification описывает **архитектуру, правила разработки, контракты и взаимодействие с backend и Telegram Mini App**.  
Документ предназначен для фронтенд-разработчиков, чтобы:

- Быстро понять, как устроен проект  
- Знать, как взаимодействовать с backend  
- Понимать архитектуру компонентов и состояния  
- Согласовывать код с командой и дизайнерами  

Не заменяет пошаговый `frontend-developer-guide.md`, а является технической спецификацией.

---

## 2. Архитектура проекта

### 2.1 Общая структура

```
src/
├─ assets/        # Картинки, иконки, шрифты
├─ components/    # Переиспользуемые UI-компоненты (кнопки, карточки, списки)
├─ pages/         # Контейнеры страниц (Dashboard, Duty, Profile)
├─ hooks/         # Кастомные хуки (например, useDuty, useUser)
├─ services/      # API-запросы и контракты с backend
├─ store/         # Глобальные состояния через Zustand
├─ styles/        # Tailwind конфиг, глобальные стили
├─ utils/         # Вспомогательные функции и утилиты
├─ App.tsx        # Основной компонент приложения
└─ main.tsx       # Точка входа
```

Каждая папка имеет отдельную ответственность, чтобы код был легко читаемым и поддерживаемым.

### 2.2 Компоненты

- **Atomic components:** кнопки, поля ввода, индикаторы состояния  
- **Composite components:** списки, карточки студентов, дежурств  
- **Pages:** контейнеры с логикой отображения, используют компоненты и store  

### 2.3 Состояние приложения

- Используется **Zustand** для глобального состояния  
- Все данные, приходящие с backend, хранятся в store  
- Изменения состояния происходят только через actions store

```ts
interface DutyState {
  id: string;
  status: "pending" | "done" | "skipped" | "reassigned";
  assignedUser: string;
}

import { create } from "zustand";

interface DutyStore {
  duties: DutyState[];
  setDuties: (d: DutyState[]) => void;
}

export const useDutyStore = create<DutyStore>((set) => ({
  duties: [],
  setDuties: (d) => set({ duties: d }),
}));
```

---

## 3. Контракты Frontend ↔ Backend

**Frontend State Contract (`frontend-state-contract.md`)** описывает:

- Формат данных, приходящих с backend  
- Что можно изменять на фронтенде  
- Какие события вызываются при изменении данных  

Пример структуры Duty:

```ts
interface DutyContract {
  id: string;
  status: "pending" | "done" | "skipped" | "reassigned";
  assignedUser: string;
  timestamp: string;
}
```

Frontend не изменяет бизнес-логику, только отображает и управляет состоянием.

---

## 4. Интеграция с Telegram Mini App

- **SDK:** `telegram-web-app` подключается в `main.tsx`  
- **MainButton и события:** `onClick`, `onOpen`, `onClose`  
- **Темы:** light/dark, синхронизированы с настройками Telegram

```ts
const tg = window.Telegram.WebApp;
tg.MainButton.setText("Начать дежурство");
tg.MainButton.show();
```

Использовать только методы SDK для взаимодействия с Telegram.

---

## 5. Tailwind CSS

- Все стили — через утилитарные классы Tailwind  
- **Глобальные стили** должны храниться в `styles/`  
- Не использовать инлайновый CSS без крайней необходимости  
- Конфиг `tailwind.config.cjs` должен содержать:

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

---

## 6. Рекомендации по разработке

1. Компоненты должны быть переиспользуемыми и атомарными  
2. Логика страниц и работы с состоянием должна быть вынесена в hooks или store  
3. Все обращения к backend — через сервисы в `services/`  
4. Проверять UI и логику на обеих темах Telegram (light/dark)  
5. Поддерживать чистый код с ESLint + Prettier  
6. Любые сторонние библиотеки согласовывать с Lead Developer  
7. Минимизировать использование глобальных переменных  

---

## 7. Полезные ссылки

| Технология/Инструмент | Документация                                                                     |
|-----------------------|----------------------------------------------------------------------------------|
| React                 | [https://react.dev/](https://react.dev/)                                         |
| TypeScript            | [https://www.typescriptlang.org/](https://www.typescriptlang.org/)               |
| Vite                  | [https://vitejs.dev/](https://vitejs.dev/)                                       |
| Tailwind CSS          | [https://tailwindcss.com/docs](https://tailwindcss.com/docs)                     |
| Zustand               | [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)                   |
| Telegram Web App SDK  | [https://core.telegram.org/bots/webapps](https://core.telegram.org/bots/webapps) |
| React Router          | [https://reactrouter.com/](https://reactrouter.com/)                             |

---

Этот документ является **технической спецификацией фронтенда**.  
Для пошагового освоения проекта см. `frontend-developer-guide.md`.  
Все изменения фронтенда должны согласовываться с Lead Developer.
