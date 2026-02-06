'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';

const BEACON_HEIGHT = 22;
const BEACON_RADIUS = 0.6;

function Beacon({ position, color }: { position: [number, number, number]; color: string }) {
  const cylinderGeo = useMemo(() => new THREE.CylinderGeometry(BEACON_RADIUS, BEACON_RADIUS, BEACON_HEIGHT, 12), []);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(BEACON_RADIUS * 1.8, 16, 12), []);
  const ringGeo = useMemo(() => new THREE.RingGeometry(BEACON_RADIUS * 2, BEACON_RADIUS * 4, 32), []);

  return (
    <group position={position}>
      {/* Tall semi-transparent pillar */}
      <mesh geometry={cylinderGeo} position={[0, BEACON_HEIGHT / 2, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.35}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing sphere cap at top */}
      <mesh geometry={sphereGeo} position={[0, BEACON_HEIGHT + BEACON_RADIUS, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Ground ring around base */}
      <mesh geometry={ringGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function ZoneBeacons() {
  return (
    <group>
      {ZONE_DEFINITIONS.map((zone) => (
        <Beacon
          key={zone.name}
          position={zone.position}
          color={zone.color}
        />
      ))}
    </group>
  );
}
