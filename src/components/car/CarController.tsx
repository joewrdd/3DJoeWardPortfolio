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
const _right = new THREE.Vector3();
const _impulse = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _velocity = new THREE.Vector3();
const _lateralVel = new THREE.Vector3();
const _forwardVel = new THREE.Vector3();

let _frameCount = 0;
let _currentSteer = 0; // smoothed steering value (-1 to 1)

export default function CarController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  // Activate hooks
  useKeyboardControls();
  useIsMobile();

  // Only subscribe to setters (stable references, no re-renders on input changes)
  const setSpeed = useGameStore((s) => s.setSpeed);
  const setIsStarted = useGameStore((s) => s.setIsStarted);
  const setCarPosition = useGameStore((s) => s.setCarPosition);
  const setCarRotation = useGameStore((s) => s.setCarRotation);

  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // Clamp delta to avoid physics explosions on tab-switch or lag spikes
    const dt = Math.min(delta, 0.05);

    // Read controls directly from Zustand snapshot (no subscription = no re-render)
    const { forward, backward, left, right, brake } = useGameStore.getState().controlsInput;

    // Mark as started if any input
    if ((forward || backward || left || right) && !useGameStore.getState().isStarted) {
      setIsStarted(true);
    }

    // --- Read physics state ---
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

    // Car orientation vectors
    _quat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    _forward.set(0, 0, -1).applyQuaternion(_quat);
    _right.set(1, 0, 0).applyQuaternion(_quat);

    // Current velocity
    const linvel = rb.linvel();
    _velocity.set(linvel.x, linvel.y, linvel.z);

    // Decompose velocity into forward and lateral components
    const forwardSpeed = _velocity.dot(_forward);
    const lateralSpeed = _velocity.dot(_right);
    const currentSpeed = Math.abs(forwardSpeed);
    const isMovingBackward = forwardSpeed < -0.3;

    carState.speed = currentSpeed * 3.6;

    // Throttle Zustand updates (~15fps) for HUD/ActiveZones
    _frameCount++;
    if (_frameCount % 4 === 0) {
      setCarPosition([pos.x, pos.y, pos.z]);
      setCarRotation([rotation.x, rotation.y, rotation.z, rotation.w]);
      setSpeed(currentSpeed * 3.6);
    }

    // =============================================
    // LATERAL FRICTION — the key to natural driving
    // =============================================
    // Kill sideways velocity so the car grips the road instead of sliding.
    // gripFactor=1 means perfect grip (go-kart), 0 means ice.
    const gripFactor = PHYSICS.lateralGrip;
    _lateralVel.copy(_right).multiplyScalar(lateralSpeed);
    _forwardVel.copy(_forward).multiplyScalar(forwardSpeed);

    // Rebuild velocity: keep all forward, remove most lateral
    _velocity.copy(_forwardVel).addScaledVector(_lateralVel, 1 - gripFactor);
    _velocity.y = linvel.y; // preserve gravity
    rb.setLinvel({ x: _velocity.x, y: _velocity.y, z: _velocity.z }, true);

    // --- Throttle / Reverse ---
    if (forward && currentSpeed < PHYSICS.maxSpeed) {
      _impulse.copy(_forward).multiplyScalar(PHYSICS.throttleForce * dt);
      rb.applyImpulse({ x: _impulse.x, y: _impulse.y, z: _impulse.z }, true);
    }
    if (backward) {
      const reverseMax = PHYSICS.maxSpeed * 0.4;
      if (currentSpeed < reverseMax || !isMovingBackward) {
        _impulse.copy(_forward).multiplyScalar(-PHYSICS.reverseForce * dt);
        rb.applyImpulse({ x: _impulse.x, y: _impulse.y, z: _impulse.z }, true);
      }
    }

    // --- Brake ---
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

    // --- Steering (direct angular velocity, smoothly interpolated) ---
    const steerInput = (left ? 1 : 0) - (right ? 1 : 0);

    if (steerInput !== 0) {
      const target = steerInput * (isMovingBackward ? -1 : 1);
      _currentSteer += (target - _currentSteer) * Math.min(1, PHYSICS.steerSpeed * dt);
    } else {
      _currentSteer *= Math.max(0, 1 - PHYSICS.steerReturnSpeed * dt);
      if (Math.abs(_currentSteer) < 0.01) _currentSteer = 0;
    }

    // Scale steering by speed — needs some speed to turn, reduced at very high speed
    if (currentSpeed > 0.3) {
      const speedFactor = Math.min(currentSpeed / 3, 1) * Math.max(0.5, 1 - currentSpeed / (PHYSICS.maxSpeed * 1.5));
      rb.setAngvel(
        { x: 0, y: _currentSteer * PHYSICS.maxSteerAngle * speedFactor, z: 0 },
        true
      );
    } else {
      // Kill angular velocity when nearly stopped
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
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
