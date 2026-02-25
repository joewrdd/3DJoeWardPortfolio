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
import { useState, useCallback, useEffect } from "react";

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("webgl2"))
    );
  } catch {
    return false;
  }
}

export default function Experience() {
  const [dpr, setDpr] = useState(1);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  const onDecline = useCallback(() => {
    setDpr((prev) => Math.max(0.8, prev - 0.2));
  }, []);

  const onIncline = useCallback(() => {
    setDpr((prev) => Math.min(2, prev + 0.1));
  }, []);

  if (!webGLSupported) {
    return (
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0612",
        color: "#fff",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>WebGL Not Available</h1>
        <p style={{ maxWidth: 480, lineHeight: 1.6, opacity: 0.7 }}>
          This 3D experience requires WebGL. Please enable hardware acceleration
          in your browser settings, update your graphics drivers, or try a
          different browser.
        </p>
      </div>
    );
  }

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
