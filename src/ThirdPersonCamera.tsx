import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayer } from './PlayerContext';

export function ThirdPersonCamera() {
  const { camera } = useThree();
  const playerRef = usePlayer();
  const offset = useRef(new THREE.Vector3(0, 4, -8)); // Height and distance behind player
  const lookAtOffset = useRef(new THREE.Vector3(0, 1.5, 0)); // Look target slightly above player feet

  useFrame(() => {
    if (!playerRef.current) return;
    const playerPos = playerRef.current.position;

    // Calculate target camera position based on player's position
    const desiredPos = playerPos.clone().add(offset.current);
    
    // Smoothly interpolate camera position
    camera.position.lerp(desiredPos, 0.08);

    // Point camera towards player
    const lookAtPos = playerPos.clone().add(lookAtOffset.current);
    camera.lookAt(lookAtPos);
  });

  return null;
}
