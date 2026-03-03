import axios from 'axios';

// Сообщаем Телеграму, что мы готовы, как можно раньше
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
}

const api = axios.create({
  // Используем относительный путь, если фронт и бэк на одном домене
  // Это исключит проблемы с CORS и лишними проверками
  baseURL: window.location.hostname === 'localhost'
    ? 'https://dezhur-app.ru/api'
    : '/api',
});

api.interceptors.request.use((config) => {
  const isDev = window.location.hostname === 'localhost';

  // Попытка взять данные из WebApp или напрямую из хэша URL
  const realTgData = window.Telegram?.WebApp?.initData ||
    window.location.hash.split('tgWebAppData=')[1]?.split('&')[0];

  const authData = isDev ? '123456789' : (realTgData || 'NO_TG_DATA_FROM_FRONT');

  config.headers['X-TG-Data'] = authData;

  return config;
});

export default api;