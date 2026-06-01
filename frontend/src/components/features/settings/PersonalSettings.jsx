import React, { useState } from 'react';
import { tgHaptics } from "../../../../services/telegram/index.js";
import Typography from '../../ui/typography/Typography.jsx';
import SwitchRow from '../../ui/toggles/SwitchRow.jsx';

function PersonalSettings() {
  const [notify, setNotify] = useState(true);

  const handleToggle = (value) => {
    tgHaptics.selection();
    setNotify(value);
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      <Typography variant="label" className="pl-4">
        Личные настройки
      </Typography>

      <SwitchRow
        label="Напоминания в Telegram"
        checked={notify}
        onChange={handleToggle}
      />
    </div>
  );
}

export default PersonalSettings;