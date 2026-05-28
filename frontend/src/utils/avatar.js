export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return "";
  return name
    .trim()
    .split(/\s+/)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // Максимум 2 буквы, чтобы не ломать верстку в мелких блоках
};