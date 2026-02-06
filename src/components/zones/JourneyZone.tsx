'use client';

import { COLORS } from '@/lib/constants';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZONE_ROAD_INFO } from '@/lib/trackUtils';
import { TIMELINE } from '@/lib/timelineData';
import NeonText from '@/components/ui/NeonText';
import TimelineMarker3D from '@/components/ui/TimelineMarker3D';

export default function JourneyZone() {
  const zone = ZONE_DEFINITIONS.find((z) => z.name === 'journey')!;
  const [x, , z] = zone.position;
  const info = ZONE_ROAD_INFO.get('journey')!;

  return (
    <group position={[x, 0, z]} rotation={[0, info.roadAngle, 0]}>
      {/* Section title */}
      <NeonText
        text="JOURNEY"
        position={[0, 9, 14]}
        size={1.2}
        color={COLORS.deepRose}
        emissiveIntensity={3}
      />

      {/* Timeline ground line — runs along X (road direction) at Z=14 */}
      <mesh position={[0, 0.05, 14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 0.1]} />
        <meshStandardMaterial
          color={COLORS.hotPink}
          emissive={COLORS.hotPink}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Timeline markers — spread along X, zigzag Z depth */}
      {TIMELINE.map((entry, i) => (
        <TimelineMarker3D
          key={entry.year}
          entry={entry}
          position={[
            -10 + i * 5,
            0,
            i % 2 === 0 ? 13 : 16,
          ]}
        />
      ))}

      {/* Zone spotlight */}
      <spotLight
        position={[0, 22, 10]}
        intensity={15}
        angle={0.7}
        penumbra={0.5}
        color={COLORS.deepRose}
        distance={40}
      />
    </group>
  );
}
