import { hapticFeedback } from '@telegram-apps/sdk-react';
import { IS_DEV } from '../../src/config';

class TelegramHapticsService {
  notification(type = 'warning') {
    if (IS_DEV) {
      console.log(`%c[Haptic-Dev] 📳 Вибрация уведомления: ${type}`, 'color: #888;');
      return;
    }
    try {
      hapticFeedback.notificationOccurred(type);
    } catch (e) {
      console.error('[TG-Haptics] Ошибка вызова notification:', e);
    }
  }

  selection() {
    if (IS_DEV) {
      console.log('%c[Haptic-Dev] 📳 Вибрация: изменение выбора (подмена на light impact)', 'color: #888;');
      return;
    }
    try {
      // Подменяем капризный selectionChanged на чёткий лёгкий клик
      hapticFeedback.impactOccurred('light');
    } catch (e) {
      console.error('[TG-Haptics] Ошибка вызова selection (light impact):', e);
    }
  }

  impact(style = 'medium') {
    if (IS_DEV) {
      console.log(`%c[Haptic-Dev] 📳 Вибрация клика: ${style}`, 'color: #888;');
      return;
    }
    try {
      hapticFeedback.impactOccurred(style);
    } catch (e) {
      console.error('[TG-Haptics] Ошибка вызова impact:', e);
    }
  }
}

export const tgHaptics = new TelegramHapticsService();