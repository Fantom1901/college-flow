import { popup } from '@tma.js/sdk';
import { IS_DEV } from '../../src/config';

class TelegramAlertsService {
  async showAlert(message, callback = null) {
    if (!message) return;

    if (IS_DEV) {
      console.log(`%c[TG-Alert-Dev] 🔔 Попап: ${message}`, 'color: #00ffff; font-weight: bold; background: #1a1a1a; padding: 4px 8px;');
      if (callback) setTimeout(callback, 100);
      return;
    }

    try {
      // Проверяем поддержку согласно новой доке
      if (!popup.isSupported()) {
        alert(message);
        if (callback) callback();
        return;
      }

      // Вызываем переименованный метод .show()
      const buttonId = await popup.show({
        title: 'Внимание',
        message: message,
        buttons: [{ id: 'ok', type: 'default', text: 'OK' }]
      });

      // Логика завершения промиса
      if (callback) callback();
    } catch (e) {
      console.error('[TG-Alerts] Ошибка вызова popup.show:', e);
      alert(message);
      if (callback) callback();
    }
  }

  async showConfirm(message, callback) {
    if (!message || typeof callback !== 'function') return;

    if (IS_DEV) {
      const result = window.confirm(`[DEV] ${message}`);
      setTimeout(() => callback(result), 100);
      return;
    }

    try {
      if (!popup.isSupported()) {
        const result = window.confirm(message);
        callback(result);
        return;
      }

      // Вызываем новый .show() для конфирма
      const buttonId = await popup.show({
        title: 'Подтверждение',
        message: message,
        buttons: [
          { id: 'yes', type: 'default', text: 'ОК' },
          { id: 'no', type: 'destructive', text: 'Отмена' }
        ]
      });

      // Новая дока говорит: если юзер не нажал кнопку, вернет null, обрабатываем как отмену (false)
      callback(buttonId === 'yes');
    } catch (e) {
      console.error('[TG-Alerts] Ошибка вызова confirm popup.show:', e);
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