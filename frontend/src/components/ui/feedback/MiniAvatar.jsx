import React from 'react';
import { getInitials } from '../../../utils/avatar.js';

/**
 * MiniAvatar - Компактная плашка аватара с инициалами
 * @param {string} name - Полное имя студента
 */
const MiniAvatar = ({ name }) => {
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 shadow-lg shrink-0 border border-white/10">
      <b className="text-white text-[11px] italic">
        {getInitials(name)}
      </b>
    </div>
  );
};

export default MiniAvatar;