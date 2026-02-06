'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { PHYSICS } from '@/lib/constants';
import { useGameStore } from '@/store/useGameStore';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useIsMobile } from '@/hooks/useIsMobile';
import { carState } from '@/lib/carState';
import CarModel from './CarModel';

// Pre-allocate all reusable objects (zero GC pressure)
const _forward = new THREE.Vector3();
const _impulse = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _velocity = new THREE.Vector3();

let _frameCount = 0;

export default function CarController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  // Activate hooks
  useKeyboardControls();
  useIsMobile();

  const controlsInput = useGameStore((s) => s.controlsInput);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const setIsStarted = useGameStore((s) => s.setIsStarted);
  const setCarPosition = useGameStore((s) => s.setCarPosition);
  const setCarRotation = useGameStore((s) => s.setCarRotation);

  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const { forward, backward, left, right, brake } = controlsInput;

    // Mark as started if any input (only when not already started)
    if ((forward || backward || left || right) && !useGameStore.getState().isStarted) {
      setIsStarted(true);
    }

    // Get physics state
    const pos = rb.translation();
    const rotation = rb.rotation();

    // Write to shared mutable state (zero overhead, no React re-renders)
    carState.position[0] = pos.x;
    carState.position[1] = pos.y;
    carState.position[2] = pos.z;
    carState.rotation[0] = rotation.x;
    carState.rotation[1] = rotation.y;
    carState.rotation[2] = rotation.z;
    carState.rotation[3] = rotation.w;

    // Forward direction from rotation (reuse pre-allocated quaternion)
    _quat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    _forward.set(0, 0, -1).applyQuaternion(_quat);

    // Speed + direction detection
    const linvel = rb.linvel();
    _velocity.set(linvel.x, linvel.y, linvel.z);
    const currentSpeed = _velocity.length();
    const forwardDot = _velocity.dot(_forward);
    const isMovingBackward = forwardDot < -0.3;
    carState.speed = currentSpeed * 3.6;

    // Throttle Zustand updates (~15fps instead of 60fps) for HUD/ActiveZones
    _frameCount++;
    if (_frameCount % 4 === 0) {
      setCarPosition([pos.x, pos.y, pos.z]);
      setCarRotation([rotation.x, rotation.y, rotation.z, rotation.w]);
      setSpeed(currentSpeed * 3.6);
    }

    // Throttle / reverse (use actual delta for frame-rate independence)
    if (forward && currentSpeed < PHYSICS.maxSpeed) {
      _impulse.copy(_forward).multiplyScalar(PHYSICS.throttleForce * delta);
      rb.applyImpulse({ x: _impulse.x, y: _impulse.y, z: _impulse.z }, true);
    }
    if (backward) {
      _impulse.copy(_forward).multiplyScalar(-PHYSICS.reverseForce * delta);
      rb.applyImpulse({ x: _impulse.x, y: _impulse.y, z: _impulse.z }, true);
    }

    // Brake
    if (brake) {
      const vel = rb.linvel();
      rb.setLinvel(
        {
          x: vel.x * PHYSICS.brakeForce,
          y: vel.y,
          z: vel.z * PHYSICS.brakeForce,
        },
        true
      );
    }

    // Steering (only when moving)
    if (currentSpeed > 0.3) {
      const steerDir = (left ? 1 : 0) - (right ? 1 : 0);
      if (steerDir !== 0) {
        // Invert steering when reversing so it feels natural
        const effectiveSteerDir = isMovingBackward ? -steerDir : steerDir;
        // Scale steering by speed — responsive at low speed, full at cruising
        const steerScale = Math.max(0.3, Math.min(currentSpeed / 5, 1));
        rb.applyTorqueImpulse(
          { x: 0, y: effectiveSteerDir * PHYSICS.steerTorque * steerScale * delta, z: 0 },
          true
        );
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[10, 2, -3]}
      colliders={false}
      mass={PHYSICS.chassisMass}
      linearDamping={PHYSICS.linearDamping}
      angularDamping={PHYSICS.angularDamping}
      enabledRotations={[false, true, false]}
      canSleep={false}
    >
      <CuboidCollider
        args={[
          PHYSICS.chassisSize[0] / 2,
          PHYSICS.chassisSize[1] / 2,
          PHYSICS.chassisSize[2] / 2,
        ]}
        position={[0, PHYSICS.chassisSize[1] / 2, 0]}
      />
      <CarModel />
    </RigidBody>
  );
}
