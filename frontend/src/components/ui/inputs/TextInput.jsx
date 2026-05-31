import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tgHaptics } from '../../../../services/telegram/index.js'; // Корректный импорт твоего сервиса хаптиков

/**
 * TextInput - Профессиональное текстовое поле в стиле нео-брутализма и Glassmorphic.
 * Полностью синхронизировано с дизайн-системой проекта "college-flow" и Telegram WebApp.
 *
 * @param {string} label - Текст лейбла над инпутом
 * @param {string} value - Текущее значение поля
 * @param {function} onChange - Коллбэк при изменении значения
 * @param {string} placeholder - Подсказка внутри поля
 * @param {string} type - Тип инпута (text, password, email, number)
 * @param {string} errorText - Текст ошибки для визуализации валидации
 * @param {function} onError - Коллбэк, вызываемый при обнаружении ошибки
 * @param {React.ReactNode} icon - Иконка слева (опционально)
 * @param {boolean} disabled - Состояние блокировки поля
 * @param {string} className - Дополнительные кастомные Tailwind классы
 */
const TextInput = ({
                     label,
                     value,
                     onChange,
                     placeholder = '',
                     type = 'text',
                     errorText = '',
                     onError,
                     icon,
                     disabled = false,
                     className = '',
                     ...props
                   }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Вызов haptic-вибрации при обнаружении ошибки
  useEffect(() => {
    if (errorText) {
      tgHaptics.notification('error');
      if (onError) onError(errorText);
    }
  }, [errorText, onError]);

  // Обработчик ввода с эффектом механического клика Apple клавиатуры
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    // Ультра-легкий тактильный клик на каждый ввод символа для ощущения физического интерфейса
    if (newValue.length !== value?.length) {
      tgHaptics.selection();
    }
  };

  // Пересчитанные цвета для состояний под светлый/стеклянный фон
  const getInputStyles = () => {
    if (disabled) {
      return 'bg-slate-500/5 border-slate-900/5 text-slate-900/40 cursor-not-allowed select-none backdrop-blur-sm';
    }
    if (errorText) {
      return 'bg-accent-red/10 border-accent-red text-slate-900 placeholder-accent-red/40 focus:border-accent-red focus:shadow-[0_0_20px_rgba(255,69,58,0.2)]';
    }
    if (isFocused) {
      // Чистое, глубокое светлое матовое стекло при фокусе, без грязной черноты
      return 'bg-white/60 backdrop-blur-xl border-slate-950 text-slate-950 placeholder-slate-900/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)]';
    }
    // Дефолтное состояние: контрастный темный текст на матовой светлой подложке
    return 'bg-white/40 backdrop-blur-md border-slate-900/15 text-slate-900 placeholder-slate-900/40 hover:border-slate-900/30 hover:bg-white/50';
  };

  return (
    // Оригинальный motion.div для физического отклика всей карточки на нажатие
    <motion.div
      whileTap={disabled ? {} : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`w-full flex flex-col gap-1.5 ${className}`}
    >
      {/* Лейбл изменен на темный Slate для читаемости */}
      {label && (
        <label className="text-[11px] font-black italic tracking-wider text-slate-700 uppercase pl-1 select-none transition-colors duration-300">
          {label}
        </label>
      )}

      {/* Оболочка инпута */}
      <div className="relative w-full">
        {/* Анимированная левая иконка с оригинальным микро-смещением по X */}
        {icon && (
          <motion.div
            animate={{
              x: isFocused ? 2 : 0, // Иконка делает шаг вправо при фокусе
              scale: isFocused ? 1.05 : 1
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            {React.cloneElement(icon, {
              className: `w-5 h-5 transition-colors duration-300 ${
                isFocused ? 'text-slate-950' : errorText ? 'text-accent-red' : 'text-slate-500'
              }`
            })}
          </motion.div>
        )}

        {/* Нативный input с твоим оригинальным онфокусом */}
        <input
          type={type}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            tgHaptics.selection(); // Возвращен легкий клик при фокусе
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full 
            h-[50px] 
            ${icon ? 'pl-11' : 'pl-4'} 
            pr-4 
            rounded-xl 
            border 
            text-[14px] 
            font-bold 
            outline-none 
            transition-all 
            duration-300 
            ease-in-out
            ${getInputStyles()}
          `}
          {...props}
        />
      </div>

      {/* Оригинальный плавный выезд ошибки с физикой яблочной пружины */}
      <AnimatePresence>
        {errorText && (
          <motion.span
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="text-[12px] font-extrabold italic tracking-wide text-accent-red pl-1 origin-top-left"
          >
            {errorText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TextInput;