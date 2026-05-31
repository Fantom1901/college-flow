import { IS_DEV } from '../../src/config';

class TelegramHapticsService {
  constructor() {
    this.haptic = window.Telegram?.WebApp?.HapticFeedback;
  }

  /**
   * Виброотклик при уведомлениях (успех, ошибка, предупреждение)
   * @param {'success'|'warning'|'error'} type
   */
  notification(type = 'warning') {
    if (IS_DEV) {
      console.log(`%c[Haptic-Dev] 📳 Вибрация уведомления: ${type}`, 'color: #888;');
      return;
    }
    this.haptic?.notificationOccurred(type);
  }

  /**
   * Легкий виброотклик при изменении выбора (например, при переключении табов или клике на чекбокс)
   */
  selection() {
    if (IS_DEV) {
      console.log('%c[Haptic-Dev] 📳 Вибрация: изменение выбора (selection)', 'color: #888;');
      return;
    }
    this.haptic?.selectionChanged();
  }

  /**
   * Виброотклик разной степени жесткости для обычных кнопок
   * @param {'light'|'medium'|'heavy'|'rigid'|'soft'} style
   */
  impact(style = 'medium') {
    if (IS_DEV) {
      console.log(`%c[Haptic-Dev] 📳 Вибрация клика: ${style}`, 'color: #888;');
      return;
    }
    this.haptic?.impactOccurred(style);
  }
}

export const tgHaptics = new TelegramHapticsService();