import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useNPC } from './NPCContext';

interface NPCProps {
  position: [number, number, number];
  name: string;
  role?: string;
  onInteract: () => void;
}

export function NPC({ position, name, role = 'Trader', onInteract }: NPCProps) {
  const meshRef = useRef<any>(null);
  const { registerNPC } = useNPC();

  useEffect(() => {
    const cleanup = registerNPC({
      ref: meshRef,
      name,
      onInteract,
    });
    return cleanup;
  }, [name, onInteract, registerNPC]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Voxel NPC Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.6]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Voxel NPC Head */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>
      {/* Voxel NPC Hat / Emblem */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      {/* Floating Name & Action Badge */}
      <Html position={[0, 2.7, 0]} center distanceFactor={15}>
        <div className="flex flex-col items-center bg-slate-900/90 text-white px-2.5 py-1 rounded-md border border-emerald-500/40 shadow-lg text-xs select-none whitespace-nowrap pointer-events-none">
          <span className="font-bold text-emerald-400">{name}</span>
          <span className="text-[10px] text-slate-300">{role}</span>
          <span className="mt-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded border border-emerald-500/30">Press [E]</span>
        </div>
      </Html>
    </group>
  );
}
