import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassButton - Интерактивная стеклянная кнопка для карточек/действий
 * @param {React.ReactNode} children - Текст кнопки
 * @param {React.ReactNode} [icon] - Компонент иконки из lucide-react
 * @param {boolean} [loading=false] - Состояние загрузки
 * @param {'normal' | 'dense'} [density='normal'] - Плотность стекла (bg-white/20 или bg-white/30)
 * @param {string} [className=''] - Стили текста/границ (например, text-accent-red)
 */
const GlassButton = ({
                       children,
                       icon,
                       loading = false,
                       density = 'normal',
                       className = '',
                       onClick,
                       ...props
                     }) => {
  const bgDensity = density === 'dense'
    ? 'bg-white/30 hover:bg-white/40 border-white/30'
    : 'bg-white/20 hover:bg-white/30 border-white/20';

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={loading}
      onClick={onClick}
      type="button"
      className={`flex flex-1 items-center justify-center gap-1.5 h-8 px-4 rounded-xl border transition-all duration-200 outline-none disabled:opacity-50 font-extrabold text-[12px] uppercase italic tracking-wider ${bgDensity} ${className}`}
      {...props}
    >
      {loading ? '...' : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default GlassButton;