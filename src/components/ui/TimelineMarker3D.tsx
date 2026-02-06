'use client';

import { Text, Billboard } from '@react-three/drei';
import { COLORS, FONT_URL } from '@/lib/constants';
import { TimelineEntry } from '@/types';

interface TimelineMarker3DProps {
  entry: TimelineEntry;
  position: [number, number, number];
}

export default function TimelineMarker3D({ entry, position }: TimelineMarker3DProps) {
  return (
    <Billboard position={position}>
      {/* Vertical pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
        <meshStandardMaterial
          color={COLORS.hotPink}
          emissive={COLORS.hotPink}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Year sphere */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={COLORS.coral}
          emissive={COLORS.coral}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Year text */}
      <Text
        font={FONT_URL}
        position={[0, 5.3, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor={COLORS.hotPink}
      >
        {entry.year}
      </Text>

      {/* Title */}
      <Text
        font={FONT_URL}
        position={[0, 3.8, 0.5]}
        fontSize={0.3}
        color={COLORS.peach}
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {entry.title}
      </Text>

      {/* Description */}
      <Text
        position={[0, 3, 0.5]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="top"
        maxWidth={5}
        lineHeight={1.4}
      >
        {entry.description}
      </Text>
    </Billboard>
  );
}
