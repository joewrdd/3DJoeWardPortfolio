'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA } from '@/lib/constants';
import { carState } from '@/lib/carState';

// Pre-allocate all reusable objects (zero GC pressure)
const _idealPosition = new THREE.Vector3();
const _idealLookAt = new THREE.Vector3();
const _carPos = new THREE.Vector3();
const _direction = new THREE.Vector3();
const _quat = new THREE.Quaternion();

export default function FollowCamera() {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    // Read directly from shared mutable state (no Zustand subscription)
    _carPos.set(carState.position[0], carState.position[1], carState.position[2]);
    _quat.set(
      carState.rotation[0],
      carState.rotation[1],
      carState.rotation[2],
      carState.rotation[3]
    );

    // Car's forward is -Z in local space, so "behind" is +Z
    // Camera sits behind the car looking forward
    _direction.set(0, 0, 1).applyQuaternion(_quat);

    // Position camera behind and above
    _idealPosition.copy(_carPos)
      .addScaledVector(_direction, CAMERA.offset[2])
      .setY(_carPos.y + CAMERA.offset[1]);

    // Look at a point ahead of the car (in front = -Z direction)
    _idealLookAt.copy(_carPos);
    _direction.set(0, 0, -1).applyQuaternion(_quat);
    _idealLookAt.addScaledVector(_direction, Math.abs(CAMERA.lookAtOffset[2]));
    _idealLookAt.y += CAMERA.lookAtOffset[1];

    // Smooth follow
    camera.position.lerp(_idealPosition, CAMERA.lerpSpeed);
    currentLookAt.current.lerp(_idealLookAt, CAMERA.lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
