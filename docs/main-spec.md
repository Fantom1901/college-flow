# 🧭 Nixa Duty | Developer Navigation Table v2.0

## 1. Назначение документа

Этот документ является **центральным навигатором для команды разработки**.  
Он показывает, какие спецификации и гайды должны изучить участники проекта, и обеспечивает быстрый доступ к Markdown-файлам на GitHub.  

> Все ссылки актуальны и ведут в папку `docs` репозитория [College Flow](https://github.com/Fantom1901/college-flow).

---

## 2. Таблица навигации по спецификациям

| №   | Роль            | Спецификация                        | Ссылка на GitHub                                                                                                              |
|-----|-----------------|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| 1.1 | **Backend** 🖥️ | Duty Lifecycle                      | [duty-lifecycle-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/duty-lifecycle-spec.md)                   |
| 1.2 | **Backend** 🖥️ | Schedule Generation                 | [schedule-generation-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/schedule-generation-spec.md)         |
| 1.3 | **Backend** 🖥️ | Group Membership Policy             | [group-membership-policy.md](https://github.com/Fantom1901/college-flow/blob/main/docs/group-membership-policy.md)           |
| 1.4 | **Backend** 🖥️ | API Specification                   | [api_spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/api_spec.md)                                         |
| 1.5 | **Backend** 🖥️ | Backend Specification               | [backend-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/backend-spec.md)                                 |
| 1.6 | **Backend** 🖥️ | Database Schema                     | [db-schema-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/db-schema-spec.md)                             |
| 2.1 | **Frontend** ⚡ | Frontend State Contract             | [frontend-state-contract.md](https://github.com/Fantom1901/college-flow/blob/main/docs/frontend-state-contract.md)           |
| 2.2 | **Frontend** ⚡ | Telegram UI Integration             | [telegram-ui-integration-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/telegram-ui-integration-spec.md) |
| 2.3 | **Frontend** ⚡ | User Experience (UX) Specification  | [user-experience-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/user-experience-spec.md)                 |
| 2.4 | **Frontend** ⚡ | User Flow Specification             | [user_flow_spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/user_flow_spec.md)                             |
| 2.5 | **Frontend** ⚡ | Frontend Technical Specification    | [frontend-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/frontend-spec.md)                               |
| 3.1 | **Designer** 🎨 | User Experience (UX) Specification  | [user-experience-spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/user-experience-spec.md)                 |
| 3.2 | **Designer** 🎨 | User Flow Specification             | [user_flow_spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/user_flow_spec.md)                             |
| 3.3 | **Designer** 🎨 | UI/UX Design Specification          | [designer_spec.md](https://github.com/Fantom1901/college-flow/blob/main/docs/designer_spec.md)                               |

---

## 3. Таблица навигации по гайдам

| №   | Гайд                     | Ссылка на GitHub                                                                                 |
|-----|--------------------------|--------------------------------------------------------------------------------------------------|
| 1.1 | Frontend Developer Guide | [frontend-guide.md](https://github.com/Fantom1901/college-flow/blob/main/docs/frontend-guide.md) |
| 1.2 | Git & GitHub Guide       | [git-guide.md](https://github.com/Fantom1901/college-flow/blob/main/docs/git-guide.md)           |

---

## 4. Подробное описание спецификаций

### 1. Backend 🖥️

**1.1 Duty Lifecycle**  
- **Что:** Жизненный цикл дежурства (Duty) в системе.  
- **Включает:** состояния `pending`, `done`, `skipped`, `reassigned`, допустимые переходы, побочные эффекты.  
- **Зачем:** Backend строго контролирует состояние Duty, frontend только отображает.

**1.2 Schedule Generation**  
- **Что:** Алгоритмы генерации расписания дежурств.  
- **Включает:** Dynamic Weight и Static List, скользящее окно планирования, атомарность, обработку ошибок.  
- **Зачем:** Обеспечивает корректность расписания.

**1.3 Group Membership Policy**  
- **Что:** Управление составом групп.  
- **Включает:** добавление/удаление студентов, смену ролей, деактивацию.  
- **Зачем:** Поддерживает целостность данных.

**1.4 API Specification**  
- **Что:** Описание всех эндпоинтов.  
- **Включает:** форматы запросов/ответов, авторизация, коды ошибок.  
- **Зачем:** Безопасный обмен данными между frontend и backend.

**1.5 Backend Specification**  
- **Что:** Общая документация по backend.  
- **Включает:** архитектуру, стек, RBAC, алгоритмы, бизнес-логику.  
- **Зачем:** Команда backend работает с единым пониманием проекта.

**1.6 Database Schema**  
- **Что:** Схема базы данных.  
- **Включает:** таблицы, поля, индексы, триггеры.  
- **Зачем:** Обеспечивает корректную работу backend и актуальные данные для frontend.

---

### 2. Frontend ⚡

**2.1 Frontend State Contract**  
- **Что:** Контракт frontend ↔ backend.  
- **Включает:** данные, отображение, разрешенные действия.  
- **Зачем:** Frontend отображает состояние, не меняя бизнес-логику.

**2.2 Telegram UI Integration**  
- **Что:** Интеграция с Telegram Mini App.  
- **Включает:** MainButton, Haptic Feedback, light/dark theme.  
- **Зачем:** Нативный и удобный UI.

**2.3 User Experience (UX) Specification**  
- **Что:** Путь пользователя.  
- **Включает:** onboarding, ежедневное использование, обмен дежурствами, отображение посещаемости.  
- **Зачем:** Прозрачное и интуитивное взаимодействие.

**2.4 Frontend Technical Specification**  
- **Что:** Инструкции по фронтенду.  
- **Включает:** React компоненты, Telegram SDK, Tailwind CSS.  
- **Зачем:** Удобная, поддерживаемая архитектура.

**2.5 User Flow Specification** - **Что:** Детальные пути пользователя для каждой роли (Куратор, Лидер, Студент).
- **Включает:** Пошаговые переходы, логику динамических списков, сценарии обмена дежурствами и систему анти-кумовства.
- **Зачем:** Чтобы фронтенд-разработчик и дизайнер понимали логику переходов между экранами.

---

### 3. Designer 🎨

**3.1 User Experience (UX) Specification** - Основы взаимодействия.

**3.2 User Flow Specification** - Карта экранов и логика поведения кнопок (например, появление новых карточек у куратора).

**3.3 UI/UX Design Specification** - Макеты, шрифты, цвета Telegram UI Kit.

**3.4 Frontend Technical Specification** - Ограничения адаптивности и тем.
---

## 5. Подробное описание гайдов

### 1. Frontend Developer Guide 🏗️

- **Что:** Пошаговое руководство для фронтенд-разработчика, включая новичков.  
- **Включает:**  
  - Инициализация проекта (Node.js, React, Tailwind CSS)  
  - Структура фронтенда, компоненты, маршрутизация  
  - Интеграция с Telegram SDK  
  - Настройка IDE (PhpStorm/WebStorm), полезные плагины, активация через Lead Developer  
  - Работа с состояниями, контрактами backend ↔ frontend  
  - Минимальные примеры кода для понимания, без перегрузки  
- **Зачем:** Обеспечивает быстрый старт и единообразную разработку.

### 2. Git & GitHub Guide 🐙

- **Что:** Полный гайд по Git и GitHub для команды.  
- **Включает:**  
  - Установка Git на Windows  
  - Настройка Git, глобальные конфиги  
  - Основные команды терминала  
  - Работа с графическим интерфейсом в JetBrains IDE  
  - Правила работы с ветками (`main`, `develop`, `feature/*`, `hotfix/*`)  
  - Визуализация веток и workflow  
  - Примеры коммитов (для обучения, не для слепого копирования)  
  - Рекомендации для джуна  
- **Зачем:** Все члены команды знают, как корректно работать с Git и не ломать репозиторий.

---

## 6. Рекомендации по использованию

- Открывать файлы напрямую по ссылкам на GitHub.  
- Начинать изучение с UX и Duty Lifecycle.  
- Backend и Frontend сверяются с API и DB Schema.  
- Дизайнер учитывает ограничения фронтенда и правила Telegram Mini App.  
- Гайды читаются параллельно с изучением спецификаций, чтобы быстрее освоить процесс разработки.  

> Этот файл является **центральной точкой навигации** для всей команды.  
> Все изменения в спецификациях и гайдах должны отражаться здесь.  
> При любых вопросах, предложениях, обращайтесь к Lead Developer.

