import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const PLAYER_RADIUS = 0.4;
const PLAYER_HEIGHT = 1.8;
const BASE_SPEED = 6;
const SPRINT_SPEED = 11;
const JUMP_FORCE = 8;
const GRAVITY = 20;

interface PlayerProps {
  ref?: React.RefObject<any>;
}

export function Player({ ref }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const noise2D = useRef(createNoise2D());

  useEffect(() => {
    if (ref) {
      (ref as any).current = groupRef.current;
    }
  }, [ref]);

  const keys = useRef<{ [key: string]: boolean }>({});
  const velocityY = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  function getTerrainHeight(x: number, z: number): number {
    const noise = noise2D.current(x / 10, z / 10);
    return Math.max(0, ((noise + 1) / 2) * 3);
  }

  useFrame((_, delta) => {
    const player = groupRef.current;
    if (!player) return;

    // Movement direction input
    const moveZ = (keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : 0) - 
                  (keys.current['KeyS'] || keys.current['ArrowDown'] ? 1 : 0);
    const moveX = (keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : 0) - 
                  (keys.current['KeyA'] || keys.current['ArrowLeft'] ? 1 : 0);

    const isSprinting = Boolean(keys.current['ShiftLeft'] || keys.current['ShiftRight']);
    const currentSpeed = isSprinting ? SPRINT_SPEED : BASE_SPEED;

    const moveDir = new THREE.Vector3(moveX, 0, moveZ);
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
    }

    // Apply movement displacement
    player.position.x += moveDir.x * currentSpeed * delta;
    player.position.z += moveDir.z * currentSpeed * delta;

    // Gravity & Ground collision
    const terrainHeight = getTerrainHeight(player.position.x, player.position.z);
    const groundY = terrainHeight + PLAYER_HEIGHT / 2;

    // Jump check
    if (keys.current['Space'] && Math.abs(player.position.y - groundY) < 0.2) {
      velocityY.current = JUMP_FORCE;
    }

    // Apply gravity
    velocityY.current -= GRAVITY * delta;
    player.position.y += velocityY.current * delta;

    // Clamp to terrain ground level
    if (player.position.y <= groundY) {
      player.position.y = groundY;
      velocityY.current = 0;
    }

    // Facing direction
    if (moveDir.lengthSq() > 0) {
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetAngle, 0.2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Voxel Avatar Character Mesh */}
      {/* Torso */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>
      {/* Visor / Helmet */}
      <mesh position={[0, 1.05, 0.15]}>
        <boxGeometry args={[0.45, 0.15, 0.2]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Backpack / Gear */}
      <mesh position={[0, 0.3, -0.28]}>
        <boxGeometry args={[0.5, 0.6, 0.25]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}
