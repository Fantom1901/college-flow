import { IS_DEV } from '../../src/config';

class TelegramAlertsService {
  showAlert(message, callback = null) {
    if (!message) return;

    if (IS_DEV) {
      console.log(`%c[TG-Alert-Dev] 🔔 Попап: ${message}`, 'color: #00ffff; font-weight: bold; background: #1a1a1a; padding: 4px 8px;');
      if (callback) setTimeout(callback, 100);
      return;
    }

    const tg = window.Telegram?.WebApp;
    if (tg?.showAlert) {
      tg.showAlert(message, () => {
        if (callback) callback();
      });
    } else {
      alert(message);
      if (callback) callback();
    }
  }

  showConfirm(message, callback) {
    if (!message || typeof callback !== 'function') return;

    if (IS_DEV) {
      const result = window.confirm(`[DEV] ${message}`);
      setTimeout(() => callback(result), 100);
      return;
    }

    const tg = window.Telegram?.WebApp;
    if (tg?.showConfirm) {
      tg.showConfirm(message, (isConfirmed) => callback(isConfirmed));
    } else {
      const result = window.confirm(message);
      callback(result);
    }
  }

  showError(error, fallbackMessage = 'Произошла непредвиденная ошибка') {
    const apiMessage = error?.response?.data?.detail;
    const errorMessage = typeof apiMessage === 'string' ? apiMessage : (error?.message || fallbackMessage);
    this.showAlert(`Ошибка: ${errorMessage}`);
  }
}

export const tgAlerts = new TelegramAlertsService();