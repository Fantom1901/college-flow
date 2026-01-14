# ⚡ Nixa Duty | Frontend Developer Guide v1.0

> **Цель:** Пошаговое руководство для фронтенд-разработчика (React + Vite + Tailwind + Telegram Web App), от установки до полноценной работы с проектом.  
> **Аудитория:** Начинающие и джуниор-разработчики.

---

## 1. Настройка окружения (Windows)

### 1.1 IDE: PhpStorm или WebStorm
- Рекомендуется использовать **PhpStorm или WebStorm** от JetBrains для работы с React, Tailwind и JS/TS.  
- **Официальный сайт:** [https://www.jetbrains.com](https://www.jetbrains.com)  
- **Ключи активации IDE** можно запросить у администратора проекта.

#### Рекомендуемые плагины для IDE:

| Плагин           | Назначение                                   |
|------------------|----------------------------------------------|
| ESLint           | Подсвечивание ошибок в коде JS/TS            |
| Prettier         | Авто-форматирование кода                     |
| Tailwind CSS     | Подсветка и автодополнение классов Tailwind  |
| React snippets   | Быстрое создание компонентов React           |
| GitToolBox       | Дополнительные возможности для работы с Git  |
| Rainbow Brackets | Цветное выделение скобок для удобочитаемости |

---

### 1.2 Установка Node.js и npm
1. Скачайте LTS версию Node.js: [https://nodejs.org/en/](https://nodejs.org/en/)  
2. Проверьте установку:

```bash
node -v
npm -v
```

Рекомендуемая версия Node: >=18.x

---

### 1.3 Установка Git
1. Скачайте Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)  
2. Проверьте установку:

```bash
git --version
```

---

## 2. Создание проекта

### 2.1 Инициализация через Vite

```bash
npm create vite@latest nixa-duty-frontend
cd nixa-duty-frontend
npm install
```

- Шаблон: **React**  
- Язык: **JavaScript** или **TypeScript**

---

### 2.2 Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Добавьте в `tailwind.config.cjs`:

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

- В `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 2.3 Telegram Web App SDK

```bash
npm install telegram-web-app
```

- Документация: [https://core.telegram.org/bots/webapps](https://core.telegram.org/bots/webapps)

---

## 3. Структура проекта

```
src/
├─ assets/        # Картинки, иконки
├─ components/    # Повторно используемые UI-компоненты
├─ pages/         # Страницы приложения
├─ store/         # Zustand store
├─ utils/         # Вспомогательные функции, API
├─ App.jsx
└─ main.jsx
```

Следить, чтобы каждый компонент и страница были отдельными файлами для удобства.

---

## 4. Основные технологии

| Технология           | Назначение                                      | Документация                                                                     |
|----------------------|-------------------------------------------------|----------------------------------------------------------------------------------|
| React                | Создание интерфейсов из компонентов             | [https://react.dev/](https://react.dev/)                                         |
| Vite                 | Быстрый запуск проекта                          | [https://vitejs.dev/](https://vitejs.dev/)                                       |
| Tailwind CSS         | Стилизация и темизация                          | [https://tailwindcss.com/docs](https://tailwindcss.com/docs)                     |
| Zustand              | State management (хранение данных пользователя) | [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)                   |
| Telegram Web App SDK | Интеграция с Telegram Mini App                  | [https://core.telegram.org/bots/webapps](https://core.telegram.org/bots/webapps) |

---

## 5. Рекомендации по работе

1. Разделять интерфейс на маленькие компоненты (карточка студента, список дежурств).  
2. Использовать Zustand для хранения информации о пользователях, дежурствах и обменах.  
3. Всегда обращаться к backend через отдельную утилиту API (`utils/api.js`), а не прямо из компонентов.  
4. Поддерживать чистый код с помощью ESLint + Prettier.  
5. Проверять каждый компонент отдельно перед коммитом.

---

## 6. Минимальные примеры

### 6.1 Компонент карточки студента

```jsx
function CardStudent({ name, duties }) {
  return <div>{name} — дежурств: {duties}</div>;
}
```

### 6.2 Telegram Web App кнопка

```js
const tg = window.Telegram.WebApp;
tg.MainButton.text = "Подтвердить";
tg.MainButton.show();
```

---

## 7. VPN и доступ к ресурсам

- Официальный сайт JetBrains и установка плагинов требуют VPN.  
- Для стабильного подключения можно попросить предоставить вам VPN-сервер через клиент AmneziaVPN.  

---

## 8. Итог

Следуя этому гиду, фронтендер сможет:

- настроить IDE и проект,  
- понять структуру компонентов и состояние приложения,  
- интегрировать фронт с backend и Telegram SDK,  
- писать читаемый и поддерживаемый код.

Этот документ является **путеводителем джуна** в проекте Nixa Duty.
