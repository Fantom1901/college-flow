import React from 'react';

/**
 * Badge - Стандартизированная пилюля статуса
 * @param {React.ReactNode} children - Текст баджа
 * @param {'green' | 'red' | 'gray' | 'orange'} [variant='gray'] - Цветовая схема
 * @param {string} [className=''] - Дополнительные стили
 */
const Badge = ({ children, variant = 'gray', className = '' }) => {
    const variants = {
        green: 'text-accent-green bg-accent-green/30',
        red: 'text-accent-red bg-accent-red/30',
        orange: 'text-accent-orange bg-accent-orange/30',
        gray: 'text-slate-400 bg-white/20'
    };

    return (
      <span className={`font-black text-[11px] uppercase italic tracking-widest px-3 py-1 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
    );
};

export default Badge;