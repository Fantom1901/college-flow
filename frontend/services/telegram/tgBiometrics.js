import { biometry } from '@telegram-apps/sdk-react';
import { IS_DEV } from '../../src/config';

class TelegramBiometricsService {
  async init() {
    if (IS_DEV) {
      console.log('%c[Biometrics-Dev] 🔐 Инициализация биометрии эмулирована', 'color: #e6a23c;');
      return true;
    }

    try {
      if (!biometry.isMounted()) {
        await biometry.mount();
      }
      return !!biometry.isAvailable;
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
      if (!biometry.isMounted()) {
        await biometry.mount();
      }

      if (!biometry.isAvailable) {
        console.warn('[TelegramBiometrics] Биометрия недоступна на устройстве');
        return false;
      }

      const result = await biometry.authenticate({ reason });
      return result.status === 'success' || !!result.token;
    } catch (e) {
      console.error('[TelegramBiometrics] Ошибка аутентификации:', e);
      return false;
    }
  }

  getType() {
    if (IS_DEV) return 'face_id';
    try {
      return biometry.type || 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }
}

export const tgBiometrics = new TelegramBiometricsService();