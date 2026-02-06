'use client';

import { Suspense, useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import HomeZone from './HomeZone';
import AboutZone from './AboutZone';
import SkillsZone from './SkillsZone';
import ProjectsZone from './ProjectsZone';
import JourneyZone from './JourneyZone';
import ContactZone from './ContactZone';
import { ZoneName } from '@/types';

const ZONE_COMPONENTS: Record<ZoneName, React.ComponentType> = {
  home: HomeZone,
  about: AboutZone,
  skills: SkillsZone,
  projects: ProjectsZone,
  journey: JourneyZone,
  contact: ContactZone,
};

// Only render zones within this distance of the car
const RENDER_DISTANCE = 300;

export default function ActiveZones() {
  const carPosition = useGameStore((s) => s.carPosition);

  // Quantize to avoid re-computing on every frame
  const qx = Math.round(carPosition[0] / 5);
  const qz = Math.round(carPosition[2] / 5);

  const activeZones = useMemo(() => {
    const cx = qx * 5;
    const cz = qz * 5;

    return ZONE_DEFINITIONS.filter((zone) => {
      const dx = zone.position[0] - cx;
      const dz = zone.position[2] - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      return dist < RENDER_DISTANCE;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qx, qz]);

  return (
    <>
      {activeZones.map((zone) => {
        const Component = ZONE_COMPONENTS[zone.name];
        return (
          <Suspense key={zone.name} fallback={null}>
            <Component />
          </Suspense>
        );
      })}
    </>
  );
}
