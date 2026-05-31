import { biometry } from '@tma.js/sdk';
import { IS_DEV } from '../../src/config';

class TelegramBiometricsService {
  async init() {
    if (IS_DEV) {
      console.log('%c[Biometrics-Dev] 🔐 Инициализация биометрии эмулирована', 'color: #e6a23c;');
      return true;
    }

    try {
      // 1. Проверяем, поддерживает ли вообще текущая версия ТГ биометрию
      if (!biometry.isSupported()) {
        console.warn('[TelegramBiometrics] Биометрия не поддерживается версией Telegram');
        return false;
      }

      // 2. Если еще не смонтировано — монтируем асинхронно
      if (!biometry.isMounted()) {
        await biometry.mount();
      }

      // Возвращаем true, если модуль успешно встал
      return biometry.isMounted();
    } catch (e) {
      console.error('[TelegramBiometrics] Ошибка монтирования биометрии:', e);
      return false;
    }
  }

  async authenticate(reason = 'Подтвердите личность') {
    if (IS_DEV) {
      const pass = window.confirm(`[DEV] Пройти биометрическую проверку?\nПричина: ${reason}`);
      return pass;
    }

    try {
      // Проверяем и монтируем, если не сделали этого ранее
      if (!biometry.isSupported()) return false;
      if (!biometry.isMounted()) {
        await biometry.mount();
      }

      // Вызываем метод согласно новой доке v3
      const result = await biometry.authenticate({ reason });

      // По доке статус при успехе строго равен 'authorized'
      return result && result.status === 'authorized';
    } catch (e) {
      console.error('[TelegramBiometrics] Ошибка аутентификации:', e);
      return false;
    }
  }

  getType() {
    if (IS_DEV) return 'face_id';
    try {
      // По доке тип берется напрямую, если смонтировано
      return biometry.type || 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }
}

export const tgBiometrics = new TelegramBiometricsService();