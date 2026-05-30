export const IS_DEV = true;

export const MOCK_USER = {
  id: 1337,
  tg_id: 123456789,
  username: 'fantom',
  role: 'student', // 'student' | 'leader' | 'curator' | 'admin'
  student_profile: {
    id: 10,
    full_name: 'Ветров Тимофей',
    group_id: 1
  },
  curator_profile: null
};

// Превращаем MOCK_GROUP в единый монолит данных группы
export const MOCK_GROUP = {
  id: 1,
  name: 'ИСП-24-01', // Твоя реальная группа ККОТиП

  // 1. Список студентов группы
  students: [
    { id: 10, full_name: 'Ветров Тимофей', user_id: 1337 },
    { id: 11, full_name: 'Тюменцева Диана', user_id: 1338 },
    { id: 12, full_name: 'Боровской Данил', user_id: 1339 },
    { id: 13, full_name: 'Анастасия Кузнецова', user_id: 1340 },
    { id: 14, full_name: 'Данила Козлов', user_id: 1341 },
    { id: 15, full_name: 'Елизавета Попова', user_id: 1342 }
  ],

  // 2. Недельное расписание дежурств (упаковано внутрь группы под схемы openapi)
  weekly_duty: [
    {
      id: 1,
      date: '2026-05-30',
      students: [
        { id: 10, full_name: 'Ветров Тимофей' },
        { id: 13, full_name: 'Анастасия Кузнецова' }
      ],
      status: 'completed'
    },
    {
      id: 2,
      date: '2026-05-31',
      students: [
        { id: 11, full_name: 'Тюменцева Диана' },
        { id: 14, full_name: 'Данила Козлов' }
      ],
      status: 'pending'
    },
    {
      id: 3,
      date: '2026-06-01',
      students: [
        { id: 12, full_name: 'Боровской Данил' },
        { id: 15, full_name: 'Елизавета Попова' }
      ],
      status: 'pending'
    }
  ],

  // 3. Лидерборд группы
  leaderboard: [
    { id: 1, full_name: 'Ветров Тимофей', points: 150 },
    { id: 2, full_name: 'Тюменцева Диана', points: 125 },
    { id: 3, full_name: 'Боровской Данил.', points: 90 },
    { id: 4, full_name: 'Анастасия Кузнецова', points: 75 },
    { id: 5, full_name: 'Данила Козлов', points: 40 },
    { id: 6, full_name: 'Елизавета Попова', points: 15 }
  ],

  // 4. Текущие настройки автоматизации группы
  settings: {
    mechanism: 'alphabetical',
    work_days: [1, 3, 5],
    person_per_day: 2,
    group_id: 1
  }
};

// Историю обменов пока оставляем отдельным экспортом для ExchangeView
export const MOCK_EXCHANGE = {
  incoming: [
    {
      id: 101,
      initiator_id: 12,
      suggested_id: 10,
      initiator_duty_id: 3,
      suggested_duty_id: 1,
      status: 'pending',
      created_at: '2026-05-30T12:00:00Z',
      initiator: { id: 12, full_name: 'Боровской Данил' },
      suggested: { id: 10, full_name: 'Ветров Тимофей' },
      initiator_duty: { id: 3, group_id: 1, student_id: 12, date: '2026-09-14', status: 'pending' },
      suggested_duty: { id: 1, group_id: 1, student_id: 10, date: '2026-09-12', status: 'pending' }
    }
  ],
  outgoing: [
    {
      id: 102,
      initiator_id: 10,
      suggested_id: 11,
      initiator_duty_id: 1,
      suggested_duty_id: 2,
      status: 'pending',
      created_at: '2026-05-30T12:05:00Z',
      initiator: { id: 10, full_name: 'Ветров Тимофей' },
      suggested: { id: 11, full_name: 'Тюменцева Диана' },
      initiator_duty: { id: 1, group_id: 1, student_id: 10, date: '2026-09-12', status: 'pending' },
      suggested_duty: { id: 2, group_id: 1, student_id: 11, date: '2026-09-13', status: 'pending' }
    }
  ],
  history: [
    {
      id: 103,
      initiator_id: 13,
      suggested_id: 10,
      initiator_duty_id: 4,
      suggested_duty_id: 1,
      status: 'accepted',
      created_at: '2026-05-28T10:00:00Z',
      initiator: { id: 13, full_name: 'Анастасия Кузнецова' },
      suggested: { id: 10, full_name: 'Ветров Тимофей' },
      initiator_duty: { id: 4, group_id: 1, student_id: 13, date: '2026-09-10', status: 'done' },
      suggested_duty: { id: 1, group_id: 1, student_id: 10, date: '2026-09-12', status: 'done' }
    }
  ]
};