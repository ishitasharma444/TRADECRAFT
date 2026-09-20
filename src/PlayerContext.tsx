import React, { createContext, useContext, ReactNode } from 'react';

export const PlayerContext = createContext<React.RefObject<any> | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

interface PlayerProviderProps {
  children: ReactNode;
  playerRef: React.RefObject<any>;
}

export function PlayerProvider({ children, playerRef }: PlayerProviderProps) {
  return (
    <PlayerContext.Provider value={playerRef}>
      {children}
    </PlayerContext.Provider>
  );
}
