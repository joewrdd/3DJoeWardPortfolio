// Brand colors
export const COLORS = {
  darkPurple: '#2a062f',
  deepRose: '#7a1044',
  hotPink: '#e01e5a',
  coral: '#ff6f61',
  peach: '#ffd1a9',
  white: '#ffffff',
  black: '#000000',
  asphalt: '#2a2a3e',
  neonPink: '#ff1493',
  neonBlue: '#00d4ff',
} as const;

// Physics tuning — arcade with natural grip feel
export const PHYSICS = {
  throttleForce: 70,
  reverseForce: 30,
  brakeForce: 0.82,
  maxSteerAngle: 3.2,       // max angular velocity (rad/s) for steering
  steerSpeed: 10,            // how fast steering ramps up
  steerReturnSpeed: 6,       // how fast steering centers when no input
  lateralGrip: 0.92,        // 0 = ice, 1 = perfect grip (kills side-slide)
  maxSpeed: 30,
  linearDamping: 0.6,
  angularDamping: 3,
  chassisMass: 1,
  chassisSize: [2, 0.5, 4] as [number, number, number],
} as const;

// Camera config — close chase cam for immersive portfolio viewing
export const CAMERA = {
  offset: [0, 3.5, 7] as [number, number, number],
  lookAtOffset: [0, 0.5, -8] as [number, number, number],
  positionLerp: 0.06,
  lookAtLerp: 0.1,
  fov: 65,
} as const;

// Road config
export const ROAD = {
  width: 16,
  samples: 300,
  barrierHeight: 0.4,
  barrierThickness: 0.5,
} as const;

// Font
export const FONT_URL = '/fonts/orbitron-black.ttf';

// Zone content spacing
export const ZONE_CONTENT = {
  textHeight: 3,
  cardSpacing: 4,
  billboardWidth: 6,
  billboardHeight: 4,
} as const;

// Zone layout (content sits at +Z in road-aligned local space)
export const ZONE_LAYOUT = {
  contentOffset: 14,
  titleHeight: 10,
} as const;

// Building corridor along the road
export const BUILDING_CORRIDOR = {
  spacing: 25,
  offset: 35,
  zoneSkipRadius: 30,
} as const;
