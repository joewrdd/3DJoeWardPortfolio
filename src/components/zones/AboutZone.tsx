'use client';

import { Text, Billboard } from '@react-three/drei';
import { COLORS, FONT_URL } from '@/lib/constants';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZONE_ROAD_INFO } from '@/lib/trackUtils';
import NeonText from '@/components/ui/NeonText';
import Badge3D from '@/components/ui/Badge3D';

export default function AboutZone() {
  const zone = ZONE_DEFINITIONS.find((z) => z.name === 'about')!;
  const [x, , z] = zone.position;
  const info = ZONE_ROAD_INFO.get('about')!;

  const badges = [
    { label: 'Flutter Expert', offset: [-5, 6, 12] as [number, number, number] },
    { label: 'Clean Architecture', offset: [5, 6, 12] as [number, number, number] },
    { label: 'Full Stack', offset: [-5, 4.5, 12] as [number, number, number] },
    { label: 'Open to Freelance', offset: [5, 4.5, 12] as [number, number, number] },
  ];

  return (
    <group position={[x, 0, z]} rotation={[0, info.roadAngle, 0]}>
      {/* Section title */}
      <NeonText
        text="ABOUT ME"
        position={[0, 10, 13]}
        size={1.2}
        color={COLORS.coral}
        emissiveIntensity={3}
      />

      {/* Bio text */}
      <Billboard position={[0, 6.5, 14]}>
        <Text
          font={FONT_URL}
          fontSize={0.28}
          color="white"
          anchorX="center"
          anchorY="top"
          maxWidth={14}
          lineHeight={1.6}
          textAlign="center"
        >
          {`Hi, I'm Joe Ward — a passionate Full Stack Developer and Mobile Engineer.
I specialize in building beautiful, performant applications with Flutter, React, and Next.js.
I love exploring AI integration, clean architecture, and creating delightful user experiences.
Currently open to freelance work and exciting opportunities.`}
        </Text>
      </Billboard>

      {/* Floating badges — spread along X, at roadside Z */}
      {badges.map((badge, i) => (
        <Badge3D
          key={i}
          label={badge.label}
          position={badge.offset}
          color={i % 2 === 0 ? COLORS.hotPink : COLORS.coral}
        />
      ))}

      {/* Zone spotlight */}
      <spotLight
        position={[0, 18, 8]}
        intensity={15}
        angle={0.7}
        penumbra={0.5}
        color={COLORS.coral}
        distance={40}
      />
    </group>
  );
}
