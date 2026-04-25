export const formatDutyDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const options = { day: 'numeric', month: 'long' };
  const formatted = date.toLocaleDateString('ru-RU', options);

  if (isToday) return `Сегодня, ${formatted}`;
  if (isTomorrow) return `Завтра, ${formatted}`;
  return formatted;
};