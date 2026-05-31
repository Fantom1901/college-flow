import React from 'react';
import { viewport, useSignal } from '@tma.js/sdk-react';

const TelegramSafeProvider = ({ children }) => {
  const contentTopInset = useSignal(viewport.contentSafeAreaInsetTop) || 0;

  const topPadding = contentTopInset > 0 ? `${contentTopInset + 36}px` : '24px';

  return (
    <div
      className="h-screen w-full p-3 flex flex-col justify-end overflow-hidden"
      style={{ paddingTop: topPadding }}
    >
      {/* Стеклянная карточка приложения */}
      <main className="main-glass w-full max-w-md flex-1 rounded-[40px] overflow-hidden relative flex flex-col px-4 shadow-2xl border border-white/10">
        {children}
      </main>
    </div>
  );
};

export default TelegramSafeProvider;