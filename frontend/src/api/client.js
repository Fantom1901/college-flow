import axios from 'axios';

const api = axios.create({
  // Обязательно полный путь, так как фронт на другом хосте
  baseURL: 'https://dezhur-app.ru/api',
});

api.interceptors.request.use((config) => {
  const isDev = window.location.hostname === 'localhost';
  const realTgData = window.Telegram?.WebApp?.initData;

  // Теперь мы шлем ЛИБО данные ТГ, ЛИБО заглушку. Заголовок БУДЕТ ВСЕГДА.
  const authData = isDev ? '123456789' : (realTgData || 'NO_TG_DATA_FROM_FRONT');

  config.headers['X-TG-Data'] = authData;

  return config;
});

export default api;