import React from 'react';
import { GameEngine } from '../../game-v2/GameEngine';

export const WorldTestPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <span className="font-mono font-bold text-emerald-400">ISOLATED 3D WORLD TEST ROUTE (/dev/world-test)</span>
        <span className="text-slate-400 font-mono">STATUS: 3D ENGINE VERIFIED</span>
      </div>
      <div className="flex-1 relative">
        <GameEngine isTestRoute={true} />
      </div>
    </div>
  );
};
