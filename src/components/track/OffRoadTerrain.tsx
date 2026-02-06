'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

export default function OffRoadTerrain() {
  const groundTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Dark base
    ctx.fillStyle = '#0d0a14';
    ctx.fillRect(0, 0, size, size);

    // Subtle noise grain
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const brightness = 8 + Math.random() * 12;
      ctx.fillStyle = `rgba(${brightness + 5}, ${brightness}, ${brightness + 10}, 0.5)`;
      ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    // Subtle grid lines for speed perception
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <RigidBody type="fixed" friction={3}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 50]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial
          map={groundTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  );
}
