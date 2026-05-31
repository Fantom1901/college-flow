import { IS_DEV } from '../../src/config';

class TelegramBiometricsService {
  constructor() {
    this.manager = window.Telegram?.WebApp?.BiometricManager;
  }

  /**
   * Инициализирует менеджер биометрии (запрашивает доступ у Telegram)
   * @returns {Promise<boolean>} Доступна ли биометрия на устройстве в принципе
   */
  init() {
    return new Promise((resolve) => {
      if (IS_DEV) {
        console.log('%c[Biometrics-Dev] 🔐 Инициализация биометрии эмулирована', 'color: #e6a23c;');
        resolve(true);
        return;
      }

      if (!this.manager) {
        resolve(false);
        return;
      }

      this.manager.init(() => {
        resolve(this.manager.isBiometricAvailable);
      });
    });
  }

  /**
   * Запрашивает у пользователя отпечаток пальца или FaceID
   * @param {string} reason - Текст, зачем это нужно (например, "Подтвердите вход в систему")
   * @returns {Promise<boolean>} Успешно ли пройдена проверка
   */
  authenticate(reason = 'Подтвердите личность') {
    return new Promise((resolve) => {
      if (IS_DEV) {
        console.group('%c[Biometrics-Dev] 🔐 Запрос биометрии', 'color: #e6a23c; font-weight: bold;');
        const pass = window.confirm(`[DEV] Пройти биометрическую проверку?\nПричина: ${reason}`);
        console.log(`Результат проверки: ${pass ? 'Успешно' : 'Отказ'}`);
        console.groupEnd();
        resolve(pass);
        return;
      }

      if (!this.manager || !this.manager.isBiometricInited || !this.manager.isBiometricAvailable) {
        console.warn('[TelegramBiometrics] Менеджер биометрии не готов или недоступен');
        resolve(false);
        return;
      }

      this.manager.authenticate({ reason }, (isAuthenticated) => {
        resolve(isAuthenticated);
      });
    });
  }

  /**
   * Возвращает тип биометрии на устройстве ('fingerprint', 'face_id' или 'unknown')
   */
  getType() {
    if (IS_DEV) return 'face_id';
    return this.manager?.biometricType || 'unknown';
  }
}

export const tgBiometrics = new TelegramBiometricsService();