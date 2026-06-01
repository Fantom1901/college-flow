import React from 'react';
import useGroupStore from '../../../store/useGroupStore.js';
import Typography from '../../ui/typography/Typography.jsx';
import LeaderboardList from './LeaderboardList.jsx';

function Leaderboard() {
  const group = useGroupStore((state) => state.group);
  const leaderboardData = group?.leaderboard || [];

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 mt-2">
      <Typography variant="label" className="mb-2 pl-4">
        Рейтинг группы по баллам
      </Typography>

      <LeaderboardList
        data={leaderboardData}
        colorized={true}
        limit={5}
      />
    </div>
  );
}

export default Leaderboard;