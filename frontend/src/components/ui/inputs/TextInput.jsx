import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tgHaptics } from '../../../../services/telegram/index.js';

/**
 * Premium TextInput - Адаптирован под полусветлый/стеклянный фон.
 * Исправлена контрастность текста, видимость иконок и глубина фокуса.
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

  // Обработчик ввода с эффектом механического клика
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    if (newValue.length !== value?.length) {
      tgHaptics.selection();
    }
  };

  // Пересчитанные стили под светлый/стеклянный фон для идеальной читаемости
  const getInputStyles = () => {
    if (disabled) {
      return 'bg-slate-500/5 border-slate-900/5 text-slate-900/40 cursor-not-allowed select-none backdrop-blur-sm';
    }
    if (errorText) {
      return 'bg-accent-red/10 border-accent-red text-slate-900 placeholder-accent-red/40 focus:border-accent-red focus:shadow-[0_0_20px_rgba(255,69,58,0.2)]';
    }
    if (isFocused) {
      // При фокусе вместо глухого чёрного делаем чистое глубокое матовое стекло,
      // слегка притемняя фон, чтобы рамка и тёмный текст контрастировали
      return 'bg-white/60 backdrop-blur-xl border-slate-950 text-slate-950 placeholder-slate-900/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)]';
    }
    // Дефолтное состояние: аккуратное плотное стекло, текст тёмный и контрастный
    return 'bg-white/40 backdrop-blur-md border-slate-900/15 text-slate-900 placeholder-slate-900/40 hover:border-slate-900/30 hover:bg-white/50';
  };

  return (
    <motion.div
      whileTap={disabled ? {} : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`w-full flex flex-col gap-1.5 ${className}`}
    >
      {/* Лейбл теперь тёмно-серый, чтобы не теряться на светлом фоне */}
      {label && (
        <label className="text-[11px] font-black italic tracking-wider text-slate-700 uppercase pl-1 select-none transition-colors duration-300">
          {label}
        </label>
      )}

      {/* Оболочка инпута */}
      <div className="relative w-full">
        {/* Анимированная левая иконка — теперь цвета Slate вместо белого */}
        {icon && (
          <motion.div
            animate={{
              x: isFocused ? 2 : 0,
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

        {/* Нативный input со стабильным контрастом */}
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

      {/* Выезд сообщения об ошибке */}
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