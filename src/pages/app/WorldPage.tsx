import React from 'react';
import { GameEngine } from '../../game-v2/GameEngine';

export const WorldPage: React.FC = () => {
  return <GameEngine isTestRoute={false} />;
};
