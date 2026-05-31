import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tgHaptics } from '../../../../services/telegram/index.js';

/**
 * Premium TextInput - Текстовое поле в стиле Apple Glassmorphism & Нео-брутализм.
 * Снабжено микро-анимациями, физикой пружин и тактильным откликом на ввод.
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

  // Вычисление динамических стилей на основе переменных твоей темы
  const getInputStyles = () => {
    if (disabled) {
      return 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed select-none backdrop-blur-sm';
    }
    if (errorText) {
      return 'bg-accent-red/10 border-accent-red text-white placeholder-white/20 focus:border-accent-red focus:shadow-[0_0_20px_rgba(255,69,58,0.25)]';
    }
    if (isFocused) {
      // Премиальное глубокое стекло Apple: матовость увеличивается, рамка подсвечивается чисто белым
      return 'bg-black/40 backdrop-blur-xl border-white text-white placeholder-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.3)]';
    }
    // Дефолтное состояние: легкое матовое стекло, мягко реагирующее на наведение
    return 'bg-white/10 backdrop-blur-md border-white/15 text-white placeholder-white/20 hover:border-white/25 hover:bg-white/12';
  };

  return (
    // motion.div позволяет всей карточке инпута физически реагировать на нажатие
    <motion.div
      whileTap={disabled ? {} : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`w-full flex flex-col gap-1.5 ${className}`}
    >
      {/* Кастомный Apple-style Лейбл: мелкий, жирный, с аккуратным межбуквенным интервалом */}
      {label && (
        <label className="text-[11px] font-black italic tracking-wider text-label-secondary uppercase pl-1 select-none transition-colors duration-300">
          {label}
        </label>
      )}

      {/* Оболочка инпута */}
      <div className="relative w-full">
        {/* Анимированная левая иконка с микро-смещением */}
        {icon && (
          <motion.div
            animate={{
              x: isFocused ? 2 : 0, // Иконка элегантно делает шаг вправо при фокусе
              scale: isFocused ? 1.05 : 1
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            {React.cloneElement(icon, {
              className: `w-5 h-5 transition-colors duration-300 ${
                isFocused ? 'text-white' : errorText ? 'text-accent-red' : 'text-label-tertiary'
              }`
            })}
          </motion.div>
        )}

        {/* Нативный input с плавными переходами */}
        <input
          type={type}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
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
            font-medium 
            outline-none 
            transition-all 
            duration-300 
            ease-in-out
            ${getInputStyles()}
          `}
          {...props}
        />
      </div>

      {/* Выезд сообщения об ошибке с физикой пружины Apple (Плавное скольжение) */}
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