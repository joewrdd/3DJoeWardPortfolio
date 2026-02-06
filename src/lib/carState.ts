// Mutable per-frame car state — bypasses React/Zustand for performance.
// CarController writes here every frame; FollowCamera reads directly.
// Zustand is only updated periodically for HUD/ActiveZones.
export const carState = {
  position: [10, 2, -3] as [number, number, number],
  rotation: [0, 0, 0, 1] as [number, number, number, number],
  speed: 0,
};
