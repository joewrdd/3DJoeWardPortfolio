'use client';

import { Text, Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { SkillData } from '@/types';
import { FONT_URL } from '@/lib/constants';

interface SkillCard3DProps {
  skill: SkillData;
  position: [number, number, number];
  categoryColor: string;
}

export default function SkillCard3D({ skill, position, categoryColor }: SkillCard3DProps) {
  const texture = useTexture(skill.icon);

  return (
    <Billboard position={position}>
      {/* Card background */}
      <mesh>
        <planeGeometry args={[2.2, 2.8]} />
        <meshStandardMaterial
          color="#0d0d1a"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[2.3, 2.9]} />
        <meshStandardMaterial
          color={categoryColor}
          emissive={categoryColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Icon */}
      <mesh position={[0, 0.5, 0.01]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Skill name */}
      <Text
        font={FONT_URL}
        position={[0, -0.5, 0.01]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {skill.name}
      </Text>

      {/* Level bar background */}
      <mesh position={[0, -0.9, 0.01]}>
        <planeGeometry args={[1.6, 0.12]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Level bar fill */}
      <mesh position={[-0.8 + (skill.level * 1.6) / 2, -0.9, 0.02]}>
        <planeGeometry args={[skill.level * 1.6, 0.12]} />
        <meshStandardMaterial
          color={categoryColor}
          emissive={categoryColor}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
}
