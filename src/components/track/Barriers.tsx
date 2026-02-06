'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { createTrackSpline } from '@/lib/trackPath';
import { ROAD, COLORS } from '@/lib/constants';

interface BarrierSegment {
  position: [number, number, number];
  rotation: number;
  length: number;
}

// Shared materials (created once)
const neonPinkMat = new THREE.MeshStandardMaterial({
  color: COLORS.hotPink,
  emissive: COLORS.hotPink,
  emissiveIntensity: 0.8,
  toneMapped: false,
});
const neonCoralMat = new THREE.MeshStandardMaterial({
  color: COLORS.coral,
  emissive: COLORS.coral,
  emissiveIntensity: 0.8,
  toneMapped: false,
});

export default function Barriers() {
  const { leftBarriers, rightBarriers } = useMemo(() => {
    const spline = createTrackSpline();
    const barrierSpacing = 15; // Fewer barriers, each longer
    const numBarriers = Math.floor(spline.getLength() / barrierSpacing);
    const halfWidth = ROAD.width / 2 + 0.5;

    const left: BarrierSegment[] = [];
    const right: BarrierSegment[] = [];

    for (let i = 0; i < numBarriers; i++) {
      const t = i / numBarriers;
      const point = spline.getPointAt(t);
      const tangent = spline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
      const angle = Math.atan2(tangent.x, tangent.z);

      const leftPos = point.clone().addScaledVector(normal, halfWidth);
      const rightPos = point.clone().addScaledVector(normal, -halfWidth);

      left.push({
        position: [leftPos.x, ROAD.barrierHeight / 2, leftPos.z],
        rotation: angle,
        length: barrierSpacing,
      });

      right.push({
        position: [rightPos.x, ROAD.barrierHeight / 2, rightPos.z],
        rotation: angle,
        length: barrierSpacing,
      });
    }

    return { leftBarriers: left, rightBarriers: right };
  }, []);

  const stripGeo = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 1), []);

  return (
    <group>
      {leftBarriers.map((b, i) => (
        <RigidBody
          key={`bl-${i}`}
          type="fixed"
          position={b.position}
          rotation={[0, b.rotation, 0]}
          colliders={false}
        >
          <CuboidCollider args={[ROAD.barrierThickness / 2, ROAD.barrierHeight / 2, b.length / 2]} />
          <mesh
            position={[0, ROAD.barrierHeight / 2 + 0.05, 0]}
            scale={[1, 1, b.length]}
            geometry={stripGeo}
            material={neonPinkMat}
          />
        </RigidBody>
      ))}

      {rightBarriers.map((b, i) => (
        <RigidBody
          key={`br-${i}`}
          type="fixed"
          position={b.position}
          rotation={[0, b.rotation, 0]}
          colliders={false}
        >
          <CuboidCollider args={[ROAD.barrierThickness / 2, ROAD.barrierHeight / 2, b.length / 2]} />
          <mesh
            position={[0, ROAD.barrierHeight / 2 + 0.05, 0]}
            scale={[1, 1, b.length]}
            geometry={stripGeo}
            material={neonCoralMat}
          />
        </RigidBody>
      ))}
    </group>
  );
}
