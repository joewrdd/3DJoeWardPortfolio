'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function PostProcessingEffects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.9}
        mipmapBlur
        levels={4}
      />
    </EffectComposer>
  );
}
