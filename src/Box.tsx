import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Box({ position = [0, 1, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}
