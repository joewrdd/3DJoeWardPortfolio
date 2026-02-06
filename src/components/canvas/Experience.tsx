"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from 'three';
import { CAMERA } from "@/lib/constants";
import Lighting from "./Lighting";
import SceneEnvironment from "./Environment";
import PostProcessingEffects from "./PostProcessing";
import CarController from "@/components/car/CarController";
import FollowCamera from "@/components/car/FollowCamera";
import TrackLayout from "@/components/track/TrackLayout";
import ZoneSystem from "@/components/zones/ZoneSystem";
import ActiveZones from "@/components/zones/ActiveZones";
import ZoneBeacons from "@/components/zones/ZoneBeacon";
import { useState, useCallback } from "react";

export default function Experience() {
  const [dpr, setDpr] = useState(1);

  const onDecline = useCallback(() => {
    setDpr((prev) => Math.max(0.8, prev - 0.2));
  }, []);

  const onIncline = useCallback(() => {
    setDpr((prev) => Math.min(2, prev + 0.1));
  }, []);

  return (
    <Canvas
      camera={{ fov: CAMERA.fov, near: 0.1, far: 800, position: [0, 5, 15] }}
      shadows
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <fog attach="fog" args={["#0a0612", 150, 500]} />

      <PerformanceMonitor onDecline={onDecline} onIncline={onIncline} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Lighting />
          <SceneEnvironment />

          <CarController />
          <FollowCamera />

          <TrackLayout />
          <ZoneSystem />
          <ActiveZones />
          <ZoneBeacons />
        </Physics>

        <PostProcessingEffects />
      </Suspense>
    </Canvas>
  );
}
