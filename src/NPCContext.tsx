import React, { createContext, useContext, useRef, ReactNode, useCallback } from 'react';

export interface RegisteredNPC {
  ref: React.RefObject<any>;
  name: string;
  onInteract: () => void;
}

interface NPCContextType {
  npcs: RegisteredNPC[];
  registerNPC: (npc: RegisteredNPC) => () => void;
}

export const NPCContext = createContext<NPCContextType | null>(null);

export function useNPC() {
  const context = useContext(NPCContext);
  if (!context) {
    throw new Error('useNPC must be used within an NPCProvider');
  }
  return context;
}

export function NPCProvider({ children }: { children: ReactNode }) {
  const npcsRef = useRef<RegisteredNPC[]>([]);

  const registerNPC = useCallback((npc: RegisteredNPC) => {
    npcsRef.current.push(npc);
    return () => {
      npcsRef.current = npcsRef.current.filter((n) => n !== npc);
    };
  }, []);

  return (
    <NPCContext.Provider value={{ npcs: npcsRef.current, registerNPC }}>
      {children}
    </NPCContext.Provider>
  );
}
