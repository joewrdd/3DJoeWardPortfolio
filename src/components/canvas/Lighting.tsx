'use client';

export default function Lighting() {
  return (
    <>
      {/* Low ambient — let neon and street lamps be the light sources */}
      <ambientLight intensity={0.12} color="#1a1a2e" />
      {/* Moonlight directional with shadows for grounding */}
      <directionalLight
        position={[60, 120, 80]}
        intensity={0.4}
        color="#6688cc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={50}
        shadow-camera-far={250}
        shadow-bias={-0.001}
      />
      {/* Hemisphere — deep blue sky, dark purple ground */}
      <hemisphereLight args={['#1a1a3e', '#0a0612', 0.25]} />
    </>
  );
}
