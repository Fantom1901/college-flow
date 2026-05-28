export const IS_DEV = true;

export const MOCK_USER = {
  id: 1337,
  username: 'fantom',
  first_name: 'Тимофей',
  last_name: '',
  role: 'student',
  group_id: 1,
  student_profile: {
    group_id: 1
  }
};

export const MOCK_DUTY = [
  { id: 1, date: 'Сегодня, 12 сентября', users: ['Ветров Тимофей', "Ветров Тимофей"], status: 'active' },
  { id: 2, date: 'Завтра, 13 сентября', users: ['Тюменцева А.', 'Тюменцева А.'], status: 'active' },
  { id: 3, date: '14 сентября', users: ['Боровской Д.', 'Боровской Д.'], status: 'active' },
];

export const MOCK_LEADERBOARD = [
  { id: 1, full_name: 'Ветров Тимофей', points: 150 },
  { id: 2, full_name: 'Тюменцева А.', points: 125 },
  { id: 3, full_name: 'Боровской Д.', points: 90 },
  { id: 4, full_name: 'Иванов А.', points: 75 },
  { id: 5, full_name: 'Сидоров К.', points: 40 },
  { id: 6, full_name: 'Петров В.', points: 15 },
];

// Фейковые заявки на обмен для Dev Mode
export const MOCK_EXCHANGE = {
  incoming: [
    {
      id: 101,
      status: 'pending',
      initiator_duty: {
        id: 3,
        date: '2026-09-14', // Используем ISO формат дат для корректного парсинга в компоненте
        student: { full_name: 'Боровской Д.' }
      },
      suggested_duty: {
        id: 1,
        date: '2026-09-12',
        student: { full_name: 'Ветров Тимофей' }
      }
    }
  ],
  outgoing: [
    {
      id: 102,
      status: 'pending',
      initiator_duty: {
        id: 1,
        date: '2026-09-12',
        student: { full_name: 'Ветров Тимофей' }
      },
      suggested_duty: {
        id: 2,
        date: '2026-09-13',
        student: { full_name: 'Тюменцева А.' }
      }
    }
  ],
  history: [
    {
      id: 103,
      status: 'accepted',
      initiator_duty: {
        id: 4,
        date: '2026-09-10',
        student: { full_name: 'Иванов А.' }
      },
      suggested_duty: {
        id: 1,
        date: '2026-09-12',
        student: { full_name: 'Ветров Тимофей' }
      }
    },
    {
      id: 104,
      status: 'rejected',
      initiator_duty: {
        id: 1,
        date: '2026-09-12',
        student: { full_name: 'Ветров Тимофей' }
      },
      suggested_duty: {
        id: 5,
        date: '2026-09-09',
        student: { full_name: 'Сидоров К.' }
      }
    }
  ]
};