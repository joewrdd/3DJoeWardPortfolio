'use client';

import { Text, Billboard } from '@react-three/drei';
import { COLORS, FONT_URL } from '@/lib/constants';

interface Badge3DProps {
  label: string;
  position: [number, number, number];
  color?: string;
}

export default function Badge3D({ label, position, color = COLORS.hotPink }: Badge3DProps) {
  return (
    <Billboard position={position}>
      {/* Badge background */}
      <mesh>
        <planeGeometry args={[label.length * 0.2 + 0.8, 0.6]} />
        <meshStandardMaterial
          color="#0d0d1a"
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow border */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[label.length * 0.2 + 0.9, 0.7]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
      {/* Label text */}
      <Text
        font={FONT_URL}
        position={[0, 0, 0.01]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </Billboard>
  );
}
