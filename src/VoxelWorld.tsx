import * as THREE from 'three';
import React, { useMemo } from 'react';
import { createNoise2D } from 'simplex-noise';

const VOXEL_SIZE = 1;
const WORLD_SIZE = 48; // half width (96x96 grid)
const HEIGHT_SCALE = 3;

export function VoxelWorld() {
  const noise2D = useMemo(() => createNoise2D(), []);

  const mesh = useMemo(() => {
    const geometry = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x10b981, 
      roughness: 0.8,
      metalness: 0.1 
    });

    const positions: number[] = [];
    for (let x = -WORLD_SIZE; x < WORLD_SIZE; x += 2) {
      for (let z = -WORLD_SIZE; z < WORLD_SIZE; z += 2) {
        const noise = noise2D(x / 15, z / 15);
        const height = Math.max(1, Math.floor(((noise + 1) / 2) * HEIGHT_SCALE));
        for (let y = 0; y < height; y++) {
          positions.push(x * VOXEL_SIZE, y * VOXEL_SIZE, z * VOXEL_SIZE);
        }
      }
    }

    const count = positions.length / 3;
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      matrix.makeTranslation(x, y, z);
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.receiveShadow = true;
    instancedMesh.castShadow = true;

    return instancedMesh;
  }, [noise2D]);

  return <primitive object={mesh} />;
}
