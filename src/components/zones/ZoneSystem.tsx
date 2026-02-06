'use client';

import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { useGameStore } from '@/store/useGameStore';
import { ZoneName } from '@/types';

export default function ZoneSystem() {
  const setCurrentZone = useGameStore((s) => s.setCurrentZone);

  return (
    <group>
      {ZONE_DEFINITIONS.map((zone) => (
        <RigidBody
          key={zone.name}
          type="fixed"
          position={zone.position}
          colliders={false}
          sensor
        >
          <CuboidCollider
            args={[zone.size[0] / 2, zone.size[1] / 2, zone.size[2] / 2]}
            sensor
            onIntersectionEnter={() => {
              setCurrentZone(zone.name as ZoneName);
            }}
            onIntersectionExit={() => {
              // Only clear if we're leaving the current zone
              const current = useGameStore.getState().currentZone;
              if (current === zone.name) {
                setCurrentZone(null);
              }
            }}
          />
        </RigidBody>
      ))}
    </group>
  );
}
