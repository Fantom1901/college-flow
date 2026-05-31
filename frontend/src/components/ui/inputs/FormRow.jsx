import React from 'react';

/**
 * FormRow - Контейнер для поля формы с верхним мелким заголовком
 * @param {string} label - Текст заголовка поля
 * @param {React.ReactNode} children - Сам интерактивный элемент (селектор, инпут, каунтер)
 */
const FormRow = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-black uppercase italic tracking-wider text-white/60 pl-1">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormRow;