export const IS_DEV = false;

export const MOCK_USER = {
  id: 1337,
  username: 'fantom',
  first_name: 'Тимофей',
  last_name: '',
  role: 'admin',
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