import React from 'react';

const GlassCard = ({ children, variant = 'main', className = '', ...props }) => {
  const baseStyles = 'backdrop-blur-md transition-all duration-200 ease-in-out overflow-hidden';

  const variants = {
    main: 'bg-white/10 border border-white/10 rounded-[32px] p-5 shadow-xl',
    sub: 'bg-white/5 border border-white/5 rounded-[24px] p-4 shadow-md',
    interactive: 'bg-white/5 border border-white/5 rounded-[20px] p-4 active:scale-[0.98] cursor-pointer select-none',
    // Наше новое сочное неоновое стекло для форм настроек
    form: 'w-full bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[32px] p-5 flex flex-col gap-5',
    exchange: 'w-full bg-white/30 backdrop-blur-2xl border border-white/20 rounded-[28px] p-5 flex flex-col gap-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'
  };

  // Для варианта формы добавляем твой фирменный фиолетовый фильтр теней
  const inlineStyle = variant === 'form'
    ? { filter: 'drop-shadow(0px 10px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0px 0px 15px rgba(191, 90, 242, 0.15))' }
    : undefined;

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={inlineStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;