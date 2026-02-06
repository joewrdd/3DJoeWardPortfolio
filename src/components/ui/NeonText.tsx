'use client';

import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, FONT_URL } from '@/lib/constants';

interface NeonTextProps {
  text: string;
  position?: [number, number, number];
  size?: number;
  color?: string;
  emissiveIntensity?: number;
}

export default function NeonText({
  text,
  position = [0, 0, 0],
  size = 1,
  color = COLORS.hotPink,
  emissiveIntensity = 2.5,
}: NeonTextProps) {
  return (
    <Billboard position={position}>
      <Text
        font={FONT_URL}
        fontSize={size}
        anchorX="center"
        anchorY="middle"
        outlineWidth={size * 0.04}
        outlineColor={color}
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
          metalness={0.3}
          roughness={0.2}
        />
      </Text>
    </Billboard>
  );
}
