'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZoneName } from '@/types';

const ZONE_ORDER: ZoneName[] = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];

export default function ZoneCompass() {
  const carPosition = useGameStore((s) => s.carPosition);
  const carRotation = useGameStore((s) => s.carRotation);
  const currentZone = useGameStore((s) => s.currentZone);

  const nextZone = useMemo(() => {
    if (!currentZone) return ZONE_ORDER[0];
    const idx = ZONE_ORDER.indexOf(currentZone);
    return ZONE_ORDER[(idx + 1) % ZONE_ORDER.length];
  }, [currentZone]);

  const zoneDef = ZONE_DEFINITIONS.find((z) => z.name === nextZone);
  if (!zoneDef) return null;

  // Direction from car to target zone
  const dx = zoneDef.position[0] - carPosition[0];
  const dz = zoneDef.position[2] - carPosition[2];
  const distance = Math.sqrt(dx * dx + dz * dz);

  // Hide when very close (already at the zone)
  if (distance < 15) return null;

  // World-space angle to target (from +Z axis, clockwise)
  const worldAngle = Math.atan2(dx, dz);

  // Car's yaw from quaternion [x, y, z, w]
  const [qx, qy, qz, qw] = carRotation;
  const carYaw = Math.atan2(2 * (qw * qy + qx * qz), 1 - 2 * (qy * qy + qz * qz));

  // Relative angle (arrow rotation)
  const relAngle = worldAngle - carYaw;

  return (
    <div
      className="absolute top-20 right-4 md:top-24 md:right-6 flex flex-col items-center gap-1 pointer-events-none"
      style={{ userSelect: 'none' }}
    >
      <p className="text-[10px] font-mono text-white/50 tracking-wider">NEXT ZONE</p>
      <p
        className="text-sm font-bold tracking-wider"
        style={{ color: zoneDef.color }}
      >
        {zoneDef.label}
      </p>

      {/* Rotating arrow */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        style={{ transform: `rotate(${-relAngle * (180 / Math.PI)}deg)` }}
      >
        <polygon
          points="24,4 32,28 24,22 16,28"
          fill={zoneDef.color}
          opacity="0.9"
        />
        <circle cx="24" cy="24" r="22" fill="none" stroke={zoneDef.color} strokeWidth="1.5" opacity="0.3" />
      </svg>

      <p className="text-xs font-mono text-white/60">
        {Math.round(distance)}m
      </p>
    </div>
  );
}
