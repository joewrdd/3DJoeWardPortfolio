import * as THREE from 'three';

// CatmullRom spline control points forming a closed loop track
// The track winds through 6 zones spaced around the circuit
export const TRACK_CONTROL_POINTS: [number, number, number][] = [
  // Home zone (start/finish)
  [0, 0, 0],
  [30, 0, -10],
  [60, 0, -5],
  // About zone
  [90, 0, 10],
  [110, 0, 35],
  [105, 0, 65],
  // Skills zone
  [80, 0, 85],
  [50, 0, 95],
  [25, 0, 100],
  // Projects zone
  [0, 0, 110],
  [-30, 0, 105],
  [-55, 0, 90],
  // Journey zone
  [-70, 0, 65],
  [-75, 0, 40],
  [-65, 0, 15],
  // Contact zone
  [-50, 0, -5],
  [-30, 0, -12],
  [-12, 0, -5],
];

export function createTrackSpline(): THREE.CatmullRomCurve3 {
  const points = TRACK_CONTROL_POINTS.map(
    ([x, y, z]) => new THREE.Vector3(x, y, z)
  );
  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
}
