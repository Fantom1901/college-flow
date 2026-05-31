import React from 'react';

/**
 * Typography - Единый компонент для всей типографики приложения
 * @param {React.ReactNode} children - Текст или элементы внутри
 * @param {'h1' | 'cardTitle' | 'cardTitleDark' | 'label' | 'labelDark' | 'sub' | 'badge'} variant - Вариант стиля текста
 * @param {string} [className=''] - Дополнительные кастомные стили (например, mt-2 или цвет)
 * @param {React.ElementType} [as] - Кастомный HTML-тег (h1, h2, span, p, b), если дефолтный не подходит
 */
const Typography = ({
                      children,
                      variant,
                      className = '',
                      as: Component,
                      ...props
                    }) => {

  // Карта стилей на основе твоего кода
  const styles = {
    // 1. Главный заголовок экрана (из GroupHeader: название группы "ИСП-21" и т.д.)
    h1: 'font-extrabold text-[24px] text-white tracking-tight italic drop-shadow-md',

    // 2. Жирные заголовки внутри белых карточек (из SwitchRow, ExchangeCard: "Напоминания в Telegram", имена студентов)
    cardTitleDark: 'font-extrabold text-[14px] text-slate-900 tracking-tight italic',

    // 3. Жирные заголовки внутри стеклянных карточек (если где-то текст белый)
    cardTitle: 'font-extrabold text-[14px] text-white tracking-tight italic',

    // 4. Светлые верхние подзаголовки/метки над блоками (из настроек: "Личные настройки", "Алгоритм распределения")
    label: 'text-[10px] font-black uppercase italic tracking-wider text-white/50 pl-1 block',

    // 5. Тёмные подзаголовки/метки на случай, если они внутри белых блоков (из ExchangeCard: даты дежурств)
    labelDark: 'text-[10px] font-black uppercase italic tracking-wider text-slate-500 block',

    // 6. Мелкие подписи под заголовками (из GroupHeader: "Моя группа")
    sub: 'text-[11px] font-black uppercase tracking-widest text-white/50 italic block mt-0.5',

    // 7. Текст внутри кнопок и статусов (из кнопок обмена: "Принять", "Отменить")
    badge: 'font-extrabold text-[12px] uppercase italic tracking-wider',

    // 8. Текст для крупных цифр как баллы в лидерборде
    points: 'font-black text-[15px] text-slate-900 italic tracking-tight'
  };

  // Дефолтные HTML-теги для каждого варианта, чтобы соблюдать семантику
  const defaultTags = {
    h1: 'h1',
    cardTitleDark: 'b',
    cardTitle: 'b',
    label: 'span',
    labelDark: 'span',
    sub: 'span',
    badge: 'span'
  };

  const Tag = Component || defaultTags[variant] || 'p';

  return (
    <Tag className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;