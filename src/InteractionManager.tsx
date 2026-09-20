import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlayer } from './PlayerContext';
import { useNPC } from './NPCContext';

export function InteractionManager() {
  const playerRef = usePlayer();
  const { npcs } = useNPC();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastInteractTime = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!playerRef.current || !npcs || npcs.length === 0) return;

    const playerPos = playerRef.current.position;
    const now = Date.now();

    // Check if key E is currently pressed with debounce (500ms)
    if (keysPressed.current['KeyE'] && now - lastInteractTime.current > 500) {
      let closestNPC = null;
      let closestDistance = Infinity;

      for (const npc of npcs) {
        if (!npc.ref || !npc.ref.current) continue;
        const npcPos = npc.ref.current.position;
        const dist = playerPos.distanceTo(npcPos);
        if (dist < 6.0 && dist < closestDistance) {
          closestDistance = dist;
          closestNPC = npc;
        }
      }

      if (closestNPC) {
        lastInteractTime.current = now;
        closestNPC.onInteract();
      }
    }
  });

  return null;
}
