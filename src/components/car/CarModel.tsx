"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { COLORS } from "@/lib/constants";
import { carState } from "@/lib/carState";

export default function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelMeshes = useRef<THREE.Mesh[]>([]);

  const { scene } = useGLTF("/assets/3d/bmw_e46_m3_nightryder_sports_car.glb");

  const model = useMemo(() => {
    if (!scene) return null;

    const clone = scene.clone(true);

    // Auto-scale: fit to ~4 units on longest axis
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 4 / maxDim;
    clone.scale.setScalar(scaleFactor);

    // Re-measure after scale
    const scaledBox = new THREE.Box3().setFromObject(clone);
    const center = scaledBox.getCenter(new THREE.Vector3());

    // Detect wheels by mesh/material name BEFORE grounding
    wheelMeshes.current = [];
    const allMeshes: { mesh: THREE.Mesh; centerY: number }[] = [];

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        const name = (child.name || "").toLowerCase();
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        let isWheel =
          name.includes("wheel") ||
          name.includes("tyre") ||
          name.includes("tire") ||
          name.includes("rim");

        if (!isWheel) {
          for (const mat of mats) {
            const matName = (mat.name || "").toLowerCase();
            if (
              matName.includes("wheel") ||
              matName.includes("tyre") ||
              matName.includes("tire") ||
              matName.includes("rotor")
            ) {
              isWheel = true;
              break;
            }
          }
        }

        if (isWheel) {
          wheelMeshes.current.push(child);
        }

        const meshBox = new THREE.Box3().setFromObject(child);
        const meshCenter = meshBox.getCenter(new THREE.Vector3());
        allMeshes.push({ mesh: child, centerY: meshCenter.y });
      }
    });

    // Fallback: bottom-most small meshes as potential wheel parts
    if (wheelMeshes.current.length === 0 && allMeshes.length > 0) {
      const modelBox = new THREE.Box3().setFromObject(clone);
      const modelHeight = modelBox.max.y - modelBox.min.y;
      const bottomThreshold = modelBox.min.y + modelHeight * 0.35;

      const bottomMeshes = allMeshes
        .filter((m) => m.centerY < bottomThreshold)
        .sort((a, b) => a.centerY - b.centerY);

      for (const item of bottomMeshes.slice(0, 8)) {
        wheelMeshes.current.push(item.mesh);
      }
    }

    // Ground based on wheel bottoms (not bounding box bottom which may
    // include shadow planes or undercarriage geometry below the wheels)
    let groundY = scaledBox.min.y;
    if (wheelMeshes.current.length > 0) {
      let minWheelY = Infinity;
      for (const wheel of wheelMeshes.current) {
        const wheelBox = new THREE.Box3().setFromObject(wheel);
        if (wheelBox.min.y < minWheelY) minWheelY = wheelBox.min.y;
      }
      groundY = minWheelY;
    }
    clone.position.set(-center.x, -groundY, -center.z);

    return clone;
  }, [scene]);

  // Spin wheel meshes based on speed (read from shared state, not Zustand)
  useFrame((_, delta) => {
    const speed = carState.speed;
    for (const wheel of wheelMeshes.current) {
      wheel.rotation.x += speed * delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      {model ? (
        <primitive object={model} />
      ) : (
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2, 0.5, 4]} />
          <meshStandardMaterial color={COLORS.hotPink} />
        </mesh>
      )}
      {/* Headlights */}
      <pointLight
        position={[0, 0.5, 2]}
        intensity={3}
        distance={35}
        color={COLORS.peach}
      />
      {/* Tail lights */}
      <pointLight
        position={[0, 0.5, -2]}
        intensity={1.5}
        distance={12}
        color="#ff0033"
      />
    </group>
  );
}

// Preload GLB for faster initial load
useGLTF.preload("/assets/3d/bmw_e46_m3_nightryder_sports_car.glb");
