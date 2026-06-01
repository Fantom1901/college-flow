import React from 'react';

const GlassCard = ({ children, variant = 'main', className = '', ...props }) => {
  // Полностью выпилили backdrop-blur. Оставили только чистые трансформации для интерактива
  const baseStyles = 'overflow-hidden transition-[transform,background-color,border-color] duration-150 ease-in-out';

  // Вместо прозрачного белого (white/10) ставим чуть более плотные тонированные подложки,
  // чтобы текст отлично читался на любом фоне без размытия
  const variants = {
    // Твоя база: полупрозрачный, воздушный
    main: 'bg-white/40 border border-white/30 rounded-[32px] p-5 shadow-xl',

    // Второстепенный (вложенный) элемент: должен быть чуть прозрачнее и легче,
    // чтобы визуально проваливаться внутрь главного контейнера
    sub: 'bg-white/20 border border-white/20 rounded-[24px] p-4 shadow-sm',

    // Интерактивная карточка (кнопка): делаем подложку чуть плотнее, чем sub,
    // а при клике (active:) или ховере можно слегка затемнять/осветлять для отклика
    interactive: 'bg-white/25 hover:bg-white/35 active:scale-[0.98] border border-white/25 rounded-[20px] p-4 cursor-pointer select-none transition-all duration-150',

    // Форма: здесь критически важна читаемость инпутов и текста.
    // bg-white/85 дает плотный белый фон, на котором не потеряется ни один шрифт
    form: 'w-full bg-white/85 border border-white/40 rounded-[32px] p-5 flex flex-col gap-5 shadow-2xl',

    // Обменник: делаем сочную акцентную карточку. Плотность чуть меньше, чем у формы (bg-white/75),
    // но за счет жирной тени shadow-[...] она будет мощно выбиваться на передний план
    exchange: 'w-full bg-white/75 border border-white/30 rounded-[28px] p-5 flex flex-col gap-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
  };

  // Фиолетовый неоновый фильтр для форм остаётся на месте
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