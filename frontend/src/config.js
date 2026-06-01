/**
 * Глобальный конфигурационный файл моков для дизайн-системы и тестирования College-Flow.
 * Структуры данных полностью валидны и синхронизированы со спецификацией OpenAPI (Nixa Duty API v0.1.0).
 */

export const IS_DEV = true;
export const MOCK_FORCE_INIT = false;

/**
 * MOCK_USER - Текущая сессия пользователя.
 * Соответствует схеме бэкенда: UserRead
 */
export const MOCK_USER = {
  id: 1337,
  tg_id: 123456789,
  username: 'fantom',
  role: 'student', // Допустимые роли по OpenAPI: "admin", "curator", "leader", "student"
  student_profile: 1,
  curator_profile: {
    full_name: 'Петрова Анна Николаевна',
    group_id: MOCK_FORCE_INIT ? null : 1
  }
};

/**
 * MOCK_GROUP - Основные данные группы куратора.
 * Соответствует схеме бэкенда: GroupRead
 */
export const MOCK_GROUP = {
  id: 1,
  name: 'ИСП-24-01', // Реальная группа ККОТиП

  // Массив студентов группы. Соответствует схеме: StudentInGroup
  students: [
    { id: 10, full_name: 'Ветров Тимофей', user_id: 1337, user: { id: 1337, username: 'nixaDev', tg_id: 987654321, role: 'student' } },
    { id: 11, full_name: 'Тюменцева Диана', user_id: 1338, user: { id: 1338, username: 'diana_t', tg_id: 876543210, role: 'student' } },
    { id: 12, full_name: 'Боровской Данил', user_id: 1339, user: { id: 1339, username: 'borovskoy', tg_id: 765432109, role: 'student' } },
    { id: 13, full_name: 'Анастасия Кузнецова', user_id: 1340, user: null },
    { id: 14, full_name: 'Данила Козлов', user_id: 1341, user: null },
    { id: 15, full_name: 'Елизавета Попова', user_id: 1342, user: null }
  ]
};

/**
 * MOCK_WEEKLY_DUTY - Недельное расписание дежурств группы.
 * Соответствует схеме ответа эндпоинта /api/v1/duty/weekly/{group_id}: DutyScheduleWithStudent[]
 */
export const MOCK_WEEKLY_DUTY = [
  {
    id: 1,
    group_id: 1,
    student_id: 10,
    date: '2026-05-30',
    status: 'done', // Изменено с 'completed' на 'done' согласно DutyStatus Enum бэкенда
    student: { id: 10, full_name: 'Ветров Тимофей' } // Схема app__schemas__duty__StudentShort
  },
  {
    id: 2,
    group_id: 1,
    student_id: 13,
    date: '2026-05-30',
    status: 'done',
    student: { id: 13, full_name: 'Анастасия Кузнецова' }
  },
  {
    id: 3,
    group_id: 1,
    student_id: 11,
    date: '2026-05-31',
    status: 'pending',
    student: { id: 11, full_name: 'Тюменцева Диана' }
  },
  {
    id: 4,
    group_id: 1,
    student_id: 14,
    date: '2026-05-31',
    status: 'pending',
    student: { id: 14, full_name: 'Данила Козлов' }
  },
  {
    id: 5,
    group_id: 1,
    student_id: 12,
    date: '2026-06-01',
    status: 'pending',
    student: { id: 12, full_name: 'Боровской Данил' }
  },
  {
    id: 6,
    group_id: 1,
    student_id: 15,
    date: '2026-06-01',
    status: 'pending',
    student: { id: 15, full_name: 'Елизавета Попова' }
  }
];

/**
 * MOCK_DUTY_SETTINGS - Настройки автоматического распределения дежурств.
 * Соответствует схеме бэкенда: DutySettingsRead
 */
export const MOCK_DUTY_SETTINGS = {
  mechanism: 'alphabetical', // Допустимые: "alphabetical", "weighted" согласно DutyMechanism Enum
  work_days: [1, 3, 5],
  excluded_dates: [],
  person_per_day: 2,
  group_id: 1
};

/**
 * MOCK_LEADERBOARD - Рейтинг студентов (вычисляется на фронте или запрашивается отдельно).
 * Оставляем плоскую структуру для рендеринга топа.
 */
export const MOCK_LEADERBOARD = [
  { id: 1, full_name: 'Ветров Тимофей', points: 150 },
  { id: 2, full_name: 'Тюменцева Диана', points: 125 },
  { id: 3, full_name: 'Боровской Данил', points: 90 },
  { id: 4, full_name: 'Анастасия Кузнецова', points: 75 },
  { id: 5, full_name: 'Данила Козлов', points: 40 },
  { id: 6, full_name: 'Елизавета Попова', points: 15 }
];

/**
 * MOCK_EXCHANGE - Заявки на обмен дежурствами между студентами.
 * Полностью соответствует схеме бэкенда: ExchangeListResponse (набор объектов ExchangeResponse)
 */
export const MOCK_EXCHANGE = {
  incoming: [
    {
      id: 101,
      initiator_id: 12,
      initiator_duty_id: 5,
      suggested_id: 10,
      suggested_duty_id: 1,
      status: 'pending', // Допустимые: "pending", "accepted", "rejected", "cancelled"
      created_at: '2026-05-30T12:00:00Z',
      initiator: { id: 12, full_name: 'Боровской Данил', user_id: 1339 }, // Схема StudentInGroup
      suggested: { id: 10, full_name: 'Ветров Тимофей', user_id: 1337 },
      initiator_duty: { id: 5, group_id: 1, student_id: 12, date: '2026-06-01', status: 'pending' }, // Схема DutyScheduleRead
      suggested_duty: { id: 1, group_id: 1, student_id: 10, date: '2026-05-30', status: 'done' }
    }
  ],
  outgoing: [
    {
      id: 102,
      initiator_id: 10,
      initiator_duty_id: 1,
      suggested_id: 11,
      suggested_duty_id: 3,
      status: 'pending',
      created_at: '2026-05-30T12:05:00Z',
      initiator: { id: 10, full_name: 'Ветров Тимофей', user_id: 1337 },
      suggested: { id: 11, full_name: 'Тюменцева Диана', user_id: 1338 },
      initiator_duty: { id: 1, group_id: 1, student_id: 10, date: '2026-05-30', status: 'done' },
      suggested_duty: { id: 3, group_id: 1, student_id: 11, date: '2026-05-31', status: 'pending' }
    }
  ],
  history: [
    {
      id: 103,
      initiator_id: 13,
      initiator_duty_id: 2,
      suggested_id: 10,
      suggested_duty_id: 1,
      status: 'accepted', // Изменено с кастомного 'done' на валидный енам ExchangeStatus
      created_at: '2026-05-28T10:00:00Z',
      initiator: { id: 13, full_name: 'Анастасия Кузнецова', user_id: 1340 },
      suggested: { id: 10, full_name: 'Ветров Тимофей', user_id: 1337 },
      initiator_duty: { id: 2, group_id: 1, student_id: 13, date: '2026-05-30', status: 'done' },
      suggested_duty: { id: 1, group_id: 1, student_id: 10, date: '2026-05-30', status: 'done' }
    }
  ]
};