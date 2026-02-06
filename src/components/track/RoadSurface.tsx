'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, TrimeshCollider } from '@react-three/rapier';
import { createTrackSpline } from '@/lib/trackPath';
import { ROAD, COLORS } from '@/lib/constants';

function createAsphaltTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark asphalt base
  ctx.fillStyle = '#2e2e42';
  ctx.fillRect(0, 0, size, size);

  // Fine grain noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const brightness = 30 + Math.random() * 35;
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness + 6})`;
    ctx.fillRect(x, y, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
  }

  // Directional wear lines (horizontal streaks simulating tire wear)
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * size;
    ctx.strokeStyle = `rgb(${50 + Math.random() * 20}, ${50 + Math.random() * 20}, ${55 + Math.random() * 20})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Subtle cracks
  ctx.strokeStyle = 'rgba(15, 15, 25, 0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const startX = Math.random() * size;
    const startY = Math.random() * size;
    ctx.moveTo(startX, startY);
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(
        startX + (Math.random() - 0.5) * 100,
        startY + Math.random() * 80
      );
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 40);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildEdgeLine(spline: THREE.CatmullRomCurve3, samples: number, side: number) {
  const halfWidth = ROAD.width / 2;
  const lineWidth = 0.5;
  const verts: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const point = spline.getPointAt(t);
    const tangent = spline.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);

    const edgePoint = point.clone().addScaledVector(normal, halfWidth * side);
    verts.push(
      edgePoint.x + normal.x * lineWidth, 0.03, edgePoint.z + normal.z * lineWidth,
      edgePoint.x - normal.x * lineWidth, 0.03, edgePoint.z - normal.z * lineWidth,
    );

    if (i < samples) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export default function RoadSurface() {
  const { geometry, roadTexture, centerLineGeometry, leftEdgeGeo, rightEdgeGeo } = useMemo(() => {
    const spline = createTrackSpline();
    const samples = ROAD.samples;
    const halfWidth = ROAD.width / 2;

    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const point = spline.getPointAt(t);
      const tangent = spline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);

      const left = point.clone().addScaledVector(normal, halfWidth);
      const right = point.clone().addScaledVector(normal, -halfWidth);

      vertices.push(left.x, 0.01, left.z);
      vertices.push(right.x, 0.01, right.z);

      uvs.push(0, t * samples * 0.5);
      uvs.push(1, t * samples * 0.5);

      if (i < samples) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    // Procedural asphalt texture
    const tex = createAsphaltTexture();

    // Center dashed line — build per-dash quads with proper isolation
    const centerVerts: number[] = [];
    const centerIndices: number[] = [];
    const dashLength = 2;
    const gapLength = 2;
    let isDash = true;
    let accumulated = 0;
    let dashVertCount = 0;

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const point = spline.getPointAt(t);
      const segmentLength = spline.getLength() / samples;

      const prevIsDash = isDash;
      accumulated += segmentLength;

      if (accumulated > (isDash ? dashLength : gapLength)) {
        accumulated = 0;
        isDash = !isDash;
      }

      if (isDash) {
        const tangent = spline.getTangentAt(t).normalize();
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
        const lineWidth = 0.3;

        centerVerts.push(
          point.x + normal.x * lineWidth, 0.02, point.z + normal.z * lineWidth,
          point.x - normal.x * lineWidth, 0.02, point.z - normal.z * lineWidth,
        );

        // Only create triangles between consecutive vertices in the SAME dash
        if (prevIsDash && dashVertCount >= 2) {
          const v = dashVertCount;
          centerIndices.push(v - 2, v - 1, v);
          centerIndices.push(v - 1, v + 1, v);
        }
        dashVertCount += 2;
      } else {
        // Reset vertex count at dash boundary
        if (prevIsDash) {
          dashVertCount = centerVerts.length / 3;
        }
      }
    }

    const centerGeo = new THREE.BufferGeometry();
    centerGeo.setAttribute('position', new THREE.Float32BufferAttribute(centerVerts, 3));
    centerGeo.setIndex(centerIndices);
    centerGeo.computeVertexNormals();

    // Edge glow lines
    const leftEdge = buildEdgeLine(spline, samples, 1);
    const rightEdge = buildEdgeLine(spline, samples, -1);

    return { geometry: geo, roadTexture: tex, centerLineGeometry: centerGeo, leftEdgeGeo: leftEdge, rightEdgeGeo: rightEdge };
  }, []);

  return (
    <group>
      {/* Road surface with physics */}
      <RigidBody type="fixed" colliders={false}>
        <TrimeshCollider
          args={[
            geometry.attributes.position.array as Float32Array,
            geometry.index!.array as Uint32Array,
          ]}
        />
        <mesh geometry={geometry} receiveShadow>
          <meshStandardMaterial
            map={roadTexture}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* Center dashed line — bright white */}
      <mesh geometry={centerLineGeometry}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Left edge — neon pink glow */}
      <mesh geometry={leftEdgeGeo}>
        <meshStandardMaterial
          color={COLORS.hotPink}
          emissive={COLORS.hotPink}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Right edge — neon coral glow */}
      <mesh geometry={rightEdgeGeo}>
        <meshStandardMaterial
          color={COLORS.coral}
          emissive={COLORS.coral}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
