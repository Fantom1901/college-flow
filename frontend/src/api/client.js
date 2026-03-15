import axios from 'axios';

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
}

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'https://dezhur-app.ru/api'
    : '/api',
});

api.interceptors.request.use((config) => {
  const isDev = window.location.hostname === 'localhost';
  const realTgData = window.Telegram?.WebApp?.initData ||
    window.location.hash.split('tgWebAppData=')[1]?.split('&')[0];
  const authData = isDev ? '123456789' : (realTgData || 'NO_TG_DATA_FROM_FRONT');

  config.headers['X-TG-Data'] = authData;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Произошла неизвестная ошибка';
    const status = error.response?.status;

    console.error(`[API Error] Status: ${status}, Message: ${message}`);

    if (window.Telegram?.WebApp?.showAlert) {
      window.Telegram.WebApp.showAlert(`Ошибка: ${message}`);
    } else {
      alert(`Ошибка API: ${message}`);
    }

    return Promise.reject(error);
  }
);

export default api;