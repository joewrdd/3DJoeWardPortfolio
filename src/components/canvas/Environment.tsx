'use client';

import { Stars, Environment } from '@react-three/drei';

/**
 * Cyberpunk night sky — static stars + environment map for reflections.
 * Sky shader removed (expensive full-screen pass every frame).
 */
export default function SceneEnvironment() {
  return (
    <>
      <color attach="background" args={['#060412']} />
      <Stars
        radius={200}
        depth={60}
        count={1500}
        factor={3.5}
        saturation={0.2}
        fade
        speed={0}
      />
      <Environment preset="night" background={false} />
    </>
  );
}
