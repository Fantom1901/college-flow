import React from 'react';
import WhiteCard from '../cards/WhiteCard.jsx';
import Typography from "../typography/Typography.jsx";
import Switch from './Switch.jsx';

/**
 * SwitchRow - Готовая строка с текстом и переключателем в белой карточке
 * @param {string} label - Текст настройки (например, "Напоминания в Telegram")
 * @param {boolean} checked - Состояние тумблера
 * @param {function} onChange - Функция смены состояния
 * @param {string} [className=''] - Дополнительные кастомные стили
 */
const SwitchRow = ({ label, checked, onChange, className = '' }) => {
  return (
    <WhiteCard className="justify-between items-center py-3 px-4">
      <Typography variant="cardTitleDark">{label}</Typography>
      <Switch checked={checked} onChange={onChange} />
    </WhiteCard>
  );
};

export default SwitchRow;