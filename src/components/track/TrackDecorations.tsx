'use client';

import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createTrackSpline } from '@/lib/trackPath';
import { ROAD, COLORS, BUILDING_CORRIDOR } from '@/lib/constants';
import { getSplineBuildingSlots, BuildingSlot } from '@/lib/trackUtils';

// ── Shared geometries & materials ──────────────────────────────────

// Street lamp parts
const poleMat = new THREE.MeshStandardMaterial({ color: '#333333', metalness: 0.8, roughness: 0.3 });
const bulbMat = new THREE.MeshStandardMaterial({
  color: COLORS.peach, emissive: COLORS.peach, emissiveIntensity: 2.5, toneMapped: false,
});
const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 6, 6);
const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 4);
const bulbGeo = new THREE.SphereGeometry(0.2, 6, 6);

// Building shared materials
const buildingEdgeMat = new THREE.MeshStandardMaterial({
  color: COLORS.coral, emissive: COLORS.coral, emissiveIntensity: 0.5, toneMapped: false,
});

const BUILDING_BASE_COLORS = ['#2a1e30', '#1e1528', '#2e1a35', '#201430', '#251a2e'];
const buildingBodyMats = BUILDING_BASE_COLORS.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0.3 })
);

// Neon accent colors for window rows
const NEON_ACCENTS = [COLORS.hotPink, COLORS.coral, COLORS.neonBlue, COLORS.neonPink, COLORS.peach];

function neonWindowMat(color: string) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 1.2, toneMapped: false,
  });
}

const windowMats = NEON_ACCENTS.map(neonWindowMat);

// Shared window geometry (single allocation for all instances)
const windowGeo = new THREE.PlaneGeometry(0.8, 1.2);

// Reusable math objects for building window computation
const _yAxis = new THREE.Vector3(0, 1, 0);

// ── Helper: compute all window instances grouped by material ──────

interface BuildingSpec {
  width: number;
  depth: number;
  height: number;
  accentIdx: number;
  slotMatrix: THREE.Matrix4;
}

function computeAllWindows(slots: BuildingSlot[]): Map<number, THREE.Matrix4[]> {
  const result = new Map<number, THREE.Matrix4[]>();
  for (let i = 0; i < windowMats.length; i++) {
    result.set(i, []);
  }

  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];
    const seed = ((index * 7919 + 104729) % 6271) / 6271;
    const seed2 = ((index * 6271 + 7919) % 104729) / 104729;

    const width = 4 + seed * 4;
    const depth = 4 + seed2 * 3;
    const height = 10 + seed * 25;
    const accentIdx = index % windowMats.length;

    // Build slot world transform
    const slotQuat = new THREE.Quaternion().setFromAxisAngle(_yAxis, slot.rotation);
    const slotScale = new THREE.Vector3(slot.scale, slot.scale, slot.scale);
    const slotPos = new THREE.Vector3(slot.position[0], slot.position[1], slot.position[2]);
    const slotMat = new THREE.Matrix4().compose(slotPos, slotQuat, slotScale);

    const windowRows = Math.floor(height / 3);
    const windowCols = Math.max(2, Math.floor(width / 1.8));
    const sideCols = Math.max(2, Math.floor(depth / 1.8));
    const oneScale = new THREE.Vector3(1, 1, 1);

    const addWindow = (lx: number, ly: number, lz: number, rotY: number, matIdx: number) => {
      const localQuat = new THREE.Quaternion().setFromAxisAngle(_yAxis, rotY);
      const localMat = new THREE.Matrix4().compose(
        new THREE.Vector3(lx, ly, lz), localQuat, oneScale
      );
      const worldMat = new THREE.Matrix4().multiplyMatrices(slotMat, localMat);
      result.get(matIdx)!.push(worldMat);
    };

    // Front face (+Z)
    for (let row = 0; row < windowRows; row++) {
      const rowY = 2 + row * 3;
      if (rowY > height - 1) break;
      for (let col = 0; col < windowCols; col++) {
        const wSeed = ((index * 31 + row * 17 + col * 13) % 100) / 100;
        if (wSeed < 0.25) continue;
        const wX = -((windowCols - 1) * 1.5) / 2 + col * 1.5;
        const matIdx = wSeed > 0.7 ? accentIdx : (accentIdx + 2) % windowMats.length;
        addWindow(wX, rowY, depth / 2 + 0.01, 0, matIdx);
      }
    }

    // Back face (-Z)
    for (let row = 0; row < windowRows; row++) {
      const rowY = 2 + row * 3;
      if (rowY > height - 1) break;
      for (let col = 0; col < windowCols; col++) {
        const wSeed = ((index * 37 + row * 19 + col * 11) % 100) / 100;
        if (wSeed < 0.35) continue;
        const wX = -((windowCols - 1) * 1.5) / 2 + col * 1.5;
        addWindow(wX, rowY, -(depth / 2 + 0.01), Math.PI, accentIdx);
      }
    }

    // Right face (+X)
    for (let row = 0; row < windowRows; row++) {
      const rowY = 2 + row * 3;
      if (rowY > height - 1) break;
      for (let col = 0; col < sideCols; col++) {
        const wSeed = ((index * 41 + row * 23 + col * 7) % 100) / 100;
        if (wSeed < 0.4) continue;
        const wZ = -((sideCols - 1) * 1.5) / 2 + col * 1.5;
        const matIdx = wSeed > 0.7 ? accentIdx : (accentIdx + 1) % windowMats.length;
        addWindow(width / 2 + 0.01, rowY, wZ, Math.PI / 2, matIdx);
      }
    }

    // Left face (-X)
    for (let row = 0; row < windowRows; row++) {
      const rowY = 2 + row * 3;
      if (rowY > height - 1) break;
      for (let col = 0; col < sideCols; col++) {
        const wSeed = ((index * 43 + row * 29 + col * 3) % 100) / 100;
        if (wSeed < 0.4) continue;
        const wZ = -((sideCols - 1) * 1.5) / 2 + col * 1.5;
        addWindow(-(width / 2 + 0.01), rowY, wZ, -Math.PI / 2, (accentIdx + 3) % windowMats.length);
      }
    }
  }

  return result;
}

// ── Components ─────────────────────────────────────────────────────

function StreetLamp({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 3, 0]} geometry={poleGeo} material={poleMat} />
      <mesh position={[0.8, 5.5, 0]} rotation={[0, 0, -Math.PI / 6]} geometry={armGeo} material={poleMat} />
      <mesh position={[1.5, 5.8, 0]} geometry={bulbGeo} material={bulbMat} />
    </group>
  );
}

/** Building body + edges + roof (no windows — those are instanced separately) */
function BuildingShell({ slot, index }: { slot: BuildingSlot; index: number }) {
  const seed = ((index * 7919 + 104729) % 6271) / 6271;
  const seed2 = ((index * 6271 + 7919) % 104729) / 104729;

  const width = 4 + seed * 4;
  const depth = 4 + seed2 * 3;
  const height = 10 + seed * 25;
  const accentIdx = index % windowMats.length;
  const accentMat = windowMats[accentIdx];
  const accentColor = NEON_ACCENTS[accentIdx];

  return (
    <group position={slot.position} rotation={[0, slot.rotation, 0]} scale={slot.scale}>
      {/* Building body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={buildingBodyMats[index % buildingBodyMats.length]} attach="material" />
      </mesh>

      {/* Vertical edge strips */}
      {[
        [-width / 2, 0, depth / 2],
        [width / 2, 0, depth / 2],
        [-width / 2, 0, -depth / 2],
        [width / 2, 0, -depth / 2],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], height / 2, pos[2]]}>
          <boxGeometry args={[0.08, height, 0.08]} />
          <primitive object={buildingEdgeMat} attach="material" />
        </mesh>
      ))}

      {/* Roof edge strip */}
      <mesh position={[0, height + 0.04, 0]}>
        <boxGeometry args={[width + 0.1, 0.08, depth + 0.1]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* Antenna on tall buildings */}
      {height > 25 && (
        <>
          <mesh position={[0, height + 2, 0]}>
            <cylinderGeometry args={[0.05, 0.15, 4, 4]} />
            <primitive object={poleMat} attach="material" />
          </mesh>
          <mesh position={[0, height + 4.2, 0]}>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

/** Instanced windows — one draw call per material instead of one per window */
function InstancedWindows({ slots }: { slots: BuildingSlot[] }) {
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);

  const instancesByMat = useMemo(() => computeAllWindows(slots), [slots]);

  // Set instance matrices after mount
  useEffect(() => {
    for (let matIdx = 0; matIdx < windowMats.length; matIdx++) {
      const mesh = meshRefs.current[matIdx];
      const matrices = instancesByMat.get(matIdx)!;
      if (!mesh || matrices.length === 0) continue;
      for (let i = 0; i < matrices.length; i++) {
        mesh.setMatrixAt(i, matrices[i]);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  }, [instancesByMat]);

  return (
    <>
      {windowMats.map((mat, matIdx) => {
        const count = instancesByMat.get(matIdx)!.length;
        if (count === 0) return null;
        return (
          <instancedMesh
            key={matIdx}
            ref={(el) => { meshRefs.current[matIdx] = el; }}
            args={[windowGeo, mat, count]}
            frustumCulled={false}
          />
        );
      })}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function TrackDecorations() {
  const lamps = useMemo(() => {
    const spline = createTrackSpline();
    const lampSpacing = 35;
    const numLamps = Math.floor(spline.getLength() / lampSpacing);
    const halfWidth = ROAD.width / 2 + 5;
    const result: { position: [number, number, number]; rotation: number }[] = [];

    for (let i = 0; i < numLamps; i++) {
      const t = i / numLamps;
      const point = spline.getPointAt(t);
      const tangent = spline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
      const angle = Math.atan2(tangent.x, tangent.z);
      const side = i % 2 === 0 ? 1 : -1;

      const pos = point.clone().addScaledVector(normal, halfWidth * side);
      result.push({
        position: [pos.x, 0, pos.z],
        rotation: angle + (side === -1 ? Math.PI : 0),
      });
    }

    return result;
  }, []);

  const buildingSlots = useMemo(
    () => getSplineBuildingSlots(
      BUILDING_CORRIDOR.offset,
      BUILDING_CORRIDOR.spacing,
      BUILDING_CORRIDOR.zoneSkipRadius,
    ),
    []
  );

  return (
    <group>
      {lamps.map((lamp, i) => (
        <StreetLamp key={`lamp-${i}`} position={lamp.position} rotation={lamp.rotation} />
      ))}
      {buildingSlots.map((slot, i) => (
        <BuildingShell key={`bld-${i}`} slot={slot} index={i} />
      ))}
      <InstancedWindows slots={buildingSlots} />
    </group>
  );
}
