import axios from 'axios';

const api = axios.create({
  // Обязательно полный путь, так как фронт на другом хосте
  baseURL: 'https://dezhur-app.ru/api',
});

api.interceptors.request.use((config) => {
  const isDev = window.location.hostname === 'localhost';
  const realTgData = window.Telegram?.WebApp?.initData;


  const authData = isDev ? '123456789' : realTgData;

  if (authData) {
    config.headers['X-TG-Data'] = authData;
  }

  return config;
});

export default api;