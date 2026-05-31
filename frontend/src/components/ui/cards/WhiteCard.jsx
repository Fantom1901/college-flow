import React from 'react';

/**
 * WhiteCard - Базовая тупая подложка (белая карточка)
 * @param {React.ReactNode} children - Внутренний контент
 * @param {string} [className=''] - Дополнительные стили для позиционирования
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Опция пропорционального изменения скруглений и паддингов
 */
const WhiteCard = ({ children, className = '', size = 'md', ...props }) => {
  // Пропорциональный просчет скруглений и внутренних отступов в зависимости от размера
  const sizeStyles = {
    sm: 'rounded-xl py-2 px-3',
    md: 'rounded-2xl py-3 px-4',
    lg: 'rounded-[24px] py-4 px-5'
  };

  return (
    <div
      className={`w-full bg-white shadow-md border border-white/20 flex items-center justify-between ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default WhiteCard;