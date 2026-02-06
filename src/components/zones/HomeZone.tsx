'use client';

import { useRef, useEffect } from 'react';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, FONT_URL } from '@/lib/constants';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZONE_ROAD_INFO } from '@/lib/trackUtils';

export default function HomeZone() {
  const zone = ZONE_DEFINITIONS.find((z) => z.name === 'home')!;
  const [x, , z] = zone.position;
  const info = ZONE_ROAD_INFO.get('home')!;

  const spotlightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (spotlightRef.current && targetRef.current) {
      spotlightRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <group position={[x, 0, z]} rotation={[0, info.roadAngle, 0]}>
      {/* Main title "JOE WARD" */}
      <Billboard position={[0, 7, 14]}>
        <Text
          font={FONT_URL}
          fontSize={2.5}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor={COLORS.hotPink}
        >
          JOE WARD
          <meshStandardMaterial
            color={COLORS.hotPink}
            emissive={COLORS.hotPink}
            emissiveIntensity={4}
            toneMapped={false}
            metalness={0.3}
            roughness={0.2}
          />
        </Text>
      </Billboard>

      {/* Subtitle */}
      <Billboard position={[0, 4.5, 14]}>
        <Text
          font={FONT_URL}
          fontSize={0.45}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor={COLORS.coral}
        >
          FULL STACK DEVELOPER & MOBILE ENGINEER
          <meshStandardMaterial
            color={COLORS.peach}
            emissive={COLORS.peach}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      {/* Decorative line */}
      <mesh position={[0, 3.8, 14]}>
        <boxGeometry args={[12, 0.03, 0.03]} />
        <meshStandardMaterial
          color={COLORS.coral}
          emissive={COLORS.coral}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Spotlight aimed at content */}
      <spotLight
        ref={spotlightRef}
        position={[0, 18, 8]}
        intensity={15}
        angle={0.6}
        penumbra={0.5}
        color={COLORS.hotPink}
        distance={40}
      />
      <object3D ref={targetRef} position={[0, 5, 14]} />
    </group>
  );
}
