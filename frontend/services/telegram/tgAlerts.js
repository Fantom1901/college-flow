import { popup } from '@telegram-apps/sdk-react';
import { IS_DEV } from '../../src/config';

class TelegramAlertsService {
  showAlert(message, callback = null) {
    if (!message) return;

    if (IS_DEV) {
      console.log(`%c[TG-Alert-Dev] 🔔 Попап: ${message}`, 'color: #00ffff; font-weight: bold; background: #1a1a1a; padding: 4px 8px;');
      if (callback) setTimeout(callback, 100);
      return;
    }

    try {
      popup.open({
        title: 'Внимание',
        message: message,
        buttons: [{ id: 'ok', type: 'default', text: 'OK' }]
      }).then(() => {
        if (callback) callback();
      }).catch((err) => {
        console.error('[TG-Alerts] Ошибка внутри промиса popup:', err);
        if (callback) callback();
      });
    } catch (e) {
      console.error('[TG-Alerts] Ошибка вызова popup.open:', e);
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

    try {
      popup.open({
        title: 'Подтверждение',
        message: message,
        buttons: [
          { id: 'yes', type: 'default', text: 'ОК' },
          { id: 'no', type: 'destructive', text: 'Отмена' }
        ]
      }).then((buttonId) => {
        callback(buttonId === 'yes');
      }).catch((err) => {
        console.error('[TG-Alerts] Ошибка внутри промиса confirm:', err);
        callback(false);
      });
    } catch (e) {
      console.error('[TG-Alerts] Ошибка вызова confirm popup.open:', e);
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