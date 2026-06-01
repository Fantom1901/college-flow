import React, { useEffect, useRef } from 'react';
import { init, viewport } from '@tma.js/sdk-react';
import { initApp } from '../../services/initApp'; // Поправь путь если нужно
import { IS_DEV } from '../config'; // Поправь путь если нужно

const TelegramProvider = ({ children, queryClient }) => {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    initApp(queryClient);

    if (IS_DEV) {
      console.warn('[Telegram SDK] DEV MODE: Интерфейсы Telegram проигнорированы.');
      return;
    }

    try {
      init();

      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.setHeaderColor('#1a1a1a');
        tg.setBackgroundColor('#1a1a1a');
      }

      if (viewport && typeof viewport.mount === 'function') {
        viewport.mount()
          .then(() => {
            viewport.expand();
            if (viewport.requestFullscreen && typeof viewport.requestFullscreen === 'function') {
              viewport.requestFullscreen().catch((err) => {
                console.warn('[Telegram SDK] Ошибка перехода в фулскрин:', err);
              });
            }
            viewport.bindCssVars();
          })
          .catch((err) => {
            console.error('[Telegram SDK] Ошибка монтирования viewport:', err);
          });
      }
    } catch (e) {
      console.warn('[Telegram SDK] Ошибка инициализации SDK:', e);
    }
  }, [queryClient]);

  return children;
};

export default TelegramProvider;