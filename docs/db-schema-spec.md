# 🗄️ Nixa Duty Core | Database Schema Specification v1.0
> **Engine:** PostgreSQL (рекомендуется) / SQLite
> **ORM:** SQLAlchemy 2.0 (Declarative Base)
> **Naming Convention:** snake_case

---

## 1. ОБЩАЯ СТРУКТУРА (Entity-Relationship)
База строится на принципе иерархии: **Группа > Пользователи > События (Дежурства/Пропуски)**.

---

## 2. ТАБЛИЦЫ (TABLES)

### 2.1 Таблица `groups` (Учебные группы)
Хранит настройки распределения дежурств.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Autoincrement | Уникальный ID группы |
| `name` | String(50) | Not Null | Название (напр. "П-421") |
| `rotation_method` | Enum | 'weight', 'static' | Алгоритм дежурств |
| `curator_id` | Integer | Foreign Key (`users.id`) | Ссылка на куратора группы |
| `invite_token` | UUID | Unique, Index | Токен для входа по ссылке |
| `created_at` | DateTime | default=now() | Дата создания группы |

### 2.2 Таблица `users` (Пользователи)
Центральная таблица со всеми ролями и весами.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | Внутренний ID |
| `tg_id` | BigInteger | Unique, Index, Not Null | Telegram ID пользователя |
| `username` | String(32) | Nullable | Ник в Telegram |
| `full_name` | String(128) | Not Null | ФИО для списков |
| `role` | Enum | 'admin', 'moder', 'user' | Роль в системе |
| `group_id` | Integer | Foreign Key (`groups.id`) | Группа студента |
| `weight` | Float | default=0.0 | Текущий вес для алгоритма |
| `is_active` | Boolean | default=True | Статус (отчислен/активен) |

### 2.3 Таблица `duty_schedule` (Календарь дежурств)
Расписание, которое видит пользователь.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | |
| `date` | Date | Not Null, Index | Дата дежурства |
| `user_id` | Integer | Foreign Key (`users.id`) | Кто дежурит |
| `group_id` | Integer | Foreign Key (`groups.id`) | В какой группе |
| `status` | Enum | 'pending', 'done', 'skipped' | Статус выполнения |

### 2.4 Таблица `swap_requests` (Логика обмена)
Хранит историю и текущие запросы на смену дат.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | |
| `sender_id` | Integer | Foreign Key (`users.id`) | Кто инициировал |
| `receiver_id` | Integer | Foreign Key (`users.id`) | Кому предложили |
| `sender_date` | Date | Not Null | Дата, которую отдает отправитель |
| `receiver_date` | Date | Not Null | Дата, которую хочет забрать |
| `status` | Enum | 'pending', 'accepted', 'declined' | Статус запроса |

### 2.5 Таблица `attendance_logs` (Посещаемость)
Статистика для графиков Дианы.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | |
| `user_id` | Integer | Foreign Key (`users.id`) | Студент |
| `date` | Date | Not Null | Дата проверки |
| `status` | Enum | 'present', 'absent', 'late' | Результат |

---

## 3. ИНДЕКСЫ И ПРОИЗВОДИТЕЛЬНОСТЬ
Для того чтобы API Аркадия летало, создаем:
1. `idx_user_tg_id`: Ускоряет вход пользователя в Mini App.
2. `idx_duty_date_group`: Ускоряет получение календаря для конкретной группы.
3. `idx_swap_receiver`: Ускоряет показ уведомлений об обмене для получателя.

---

## 4. ТРИГГЕРЫ И БИЗНЕС-ЛОГИКА (SQLAlchemy Hooks)

1. **On Swap Accept:** При смене статуса `swap_requests.status` на 'accepted' -> автоматически обновить `user_id` в соответствующих записях `duty_schedule`.
2. **On Duty Done:** При смене `duty_schedule.status` на 'done' -> автоматически выполнить `user.weight += 1.0`.
3. **On Absence:** При записи 'absent' в посещаемость -> проверить, было ли у юзера сегодня дежурство. Если да — перенести дежурство на следующую свободную дату БЕЗ увеличения веса.

---

## 5. ПРИМЕР СВЯЗИ (Python Code Snippet)
```python
class User(Base):
    __tablename__ = "users"
    group = relationship("Group", back_populates="members")
    duties = relationship("DutySchedule", back_populates="user")