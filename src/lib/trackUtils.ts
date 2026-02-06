import * as THREE from 'three';
import { createTrackSpline, TRACK_CONTROL_POINTS } from './trackPath';
import { ZONE_DEFINITIONS } from './zoneDefinitions';

// Approximate center of the closed-loop track
const LOOP_CENTER = new THREE.Vector3(12.5, 0, 43);

export interface ZoneRoadInfo {
  /** Y-rotation so the group's local -Z faces the road and local X runs along road direction */
  roadAngle: number;
  /** Unit vector along the road at this zone */
  tangent: THREE.Vector3;
  /** Unit vector pointing outward (away from loop center) */
  outwardNormal: THREE.Vector3;
}

// Compute road-relative orientation for each zone (static, computed once)
function computeZoneRoadInfo(): Map<string, ZoneRoadInfo> {
  const spline = createTrackSpline();
  const map = new Map<string, ZoneRoadInfo>();
  const samples = 1000;

  for (const zone of ZONE_DEFINITIONS) {
    const zonePos = new THREE.Vector3(zone.position[0], 0, zone.position[2]);

    // Find closest spline t parameter
    let bestT = 0;
    let bestDist = Infinity;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const pt = spline.getPointAt(t);
      const dist = zonePos.distanceToSquared(new THREE.Vector3(pt.x, 0, pt.z));
      if (dist < bestDist) {
        bestDist = dist;
        bestT = t;
      }
    }

    const tangent = spline.getTangentAt(bestT).normalize();
    // Perpendicular in XZ plane (left-hand normal)
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    // Determine which direction is "outward" (away from loop center)
    const splinePoint = spline.getPointAt(bestT);
    const toCenter = new THREE.Vector3().subVectors(LOOP_CENTER, splinePoint).normalize();
    const dot = toCenter.dot(normal);
    const outwardNormal = dot > 0 ? normal.clone().negate() : normal.clone();

    // roadAngle: rotate group so its local -Z points toward road (i.e. local +Z = outward)
    // and local X aligns with road tangent
    const roadAngle = Math.atan2(outwardNormal.x, outwardNormal.z);

    map.set(zone.name, { roadAngle, tangent: tangent.clone(), outwardNormal });
  }

  return map;
}

export const ZONE_ROAD_INFO = computeZoneRoadInfo();

export interface BuildingSlot {
  position: [number, number, number];
  rotation: number;
  scale: number;
}

/**
 * Generate building positions along both sides of the track,
 * skipping zones so zone content has room.
 */
export function getSplineBuildingSlots(
  offset: number,
  spacing: number,
  zoneSkipRadius: number,
): BuildingSlot[] {
  const spline = createTrackSpline();
  const totalLength = spline.getLength();
  const count = Math.floor(totalLength / spacing);
  const slots: BuildingSlot[] = [];

  // Collect zone centers for skip check
  const zoneCenters = ZONE_DEFINITIONS.map(
    (z) => new THREE.Vector3(z.position[0], 0, z.position[2])
  );

  // Deterministic pseudo-random from index
  const pseudoRandom = (i: number) => ((i * 7919 + 104729) % 6271) / 6271;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const point = spline.getPointAt(t);
    const tangent = spline.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const angle = Math.atan2(normal.x, normal.z);

    for (const side of [1, -1]) {
      const pos = point.clone().addScaledVector(normal, offset * side);

      // Skip if too close to any zone center
      const tooClose = zoneCenters.some(
        (zc) => pos.distanceTo(zc) < zoneSkipRadius
      );
      if (tooClose) continue;

      const scale = 0.8 + pseudoRandom(i * 2 + (side > 0 ? 0 : 1)) * 0.6;

      slots.push({
        position: [pos.x, 0, pos.z],
        rotation: angle + (side === -1 ? Math.PI : 0),
        scale,
      });
    }
  }

  return slots;
}
