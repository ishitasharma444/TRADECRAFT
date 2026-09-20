import React from 'react';
import { Html } from '@react-three/drei';

export type BuildingType = 
  | 'house' 
  | 'market' 
  | 'stock' 
  | 'news' 
  | 'forest' 
  | 'risk' 
  | 'psychology' 
  | 'castle';

interface BuildingProps {
  type: BuildingType;
  position: [number, number, number];
  name?: string;
}

export function Building({ type, position, name }: BuildingProps) {
  let content = null;
  let title = name || type.toUpperCase();
  let badgeColor = 'emerald';

  switch (type) {
    case 'house':
      title = name || 'Beginner Village';
      badgeColor = 'emerald';
      content = (
        <group position={position}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[4, 3, 4]} />
            <meshStandardMaterial color="#8b4513" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <boxGeometry args={[5, 1, 5]} />
            <meshStandardMaterial color="#991b1b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.3, 0]}>
            <boxGeometry args={[2, 0.8, 2]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      );
      break;

    case 'market':
      title = name || 'Market City Hub';
      badgeColor = 'amber';
      content = (
        <group position={position}>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[10, 4, 10]} />
            <meshStandardMaterial color="#d97706" roughness={0.3} />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <boxGeometry args={[11, 1, 11]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>
          <mesh position={[0, 6, 0]}>
            <boxGeometry args={[6, 2, 3]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.4} />
          </mesh>
        </group>
      );
      break;

    case 'stock':
      title = name || 'Stock Exchange Tower';
      badgeColor = 'blue';
      content = (
        <group position={position}>
          <mesh position={[0, 10, 0]} castShadow>
            <boxGeometry args={[8, 20, 8]} />
            <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[0, 20.5, 0]} castShadow>
            <boxGeometry args={[9, 1, 9]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[0, 22, 0]}>
            <boxGeometry args={[3, 2, 3]} />
            <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.5} />
          </mesh>
        </group>
      );
      break;

    case 'news':
      title = name || 'News Tower';
      badgeColor = 'rose';
      content = (
        <group position={position}>
          <mesh position={[0, 12, 0]} castShadow>
            <cylinderGeometry args={[2, 4, 24, 8]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          <mesh position={[0, 25, 0]} castShadow>
            <boxGeometry args={[5, 2, 5]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 28, 0]}>
            <cylinderGeometry args={[0.1, 0.3, 6, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        </group>
      );
      break;

    case 'learning':
    case 'forest':
      title = name || 'Learning Forest';
      badgeColor = 'teal';
      content = (
        <group position={position}>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[6, 4, 6]} />
            <meshStandardMaterial color="#065f46" roughness={0.5} />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <boxGeometry args={[8, 2, 8]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
        </group>
      );
      break;

    case 'risk':
      title = name || 'Risk Mountains';
      badgeColor = 'purple';
      content = (
        <group position={position}>
          <mesh position={[0, 6, 0]} castShadow>
            <coneGeometry args={[6, 12, 4]} />
            <meshStandardMaterial color="#581c87" roughness={0.4} />
          </mesh>
          <mesh position={[0, 12.5, 0]}>
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
      break;

    case 'psychology':
      title = name || 'Psychology Caverns';
      badgeColor = 'indigo';
      content = (
        <group position={position}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <boxGeometry args={[7, 5, 7]} />
            <meshStandardMaterial color="#312e81" roughness={0.3} />
          </mesh>
          <mesh position={[0, 5.5, 0]}>
            <octahedronGeometry args={[2]} />
            <meshStandardMaterial color="#818cf8" emissive="#4338ca" emissiveIntensity={0.6} />
          </mesh>
        </group>
      );
      break;

    case 'castle':
      title = name || 'Portfolio Castle';
      badgeColor = 'cyan';
      content = (
        <group position={position}>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[9, 8, 9]} />
            <meshStandardMaterial color="#0f766e" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="#14b8a6" />
          </mesh>
        </group>
      );
      break;

    default:
      content = <group position={position} />;
  }

  return (
    <group>
      {content}
      <Html position={[position[0], position[1] + (type === 'stock' ? 24 : type === 'news' ? 30 : 7), position[2]]} center distanceFactor={25}>
        <div className="bg-slate-950/90 text-white border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-xl text-center select-none whitespace-nowrap pointer-events-none">
          <div className="text-xs font-bold text-slate-100">{title}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">ZONE DESTINATION</div>
        </div>
      </Html>
    </group>
  );
}
