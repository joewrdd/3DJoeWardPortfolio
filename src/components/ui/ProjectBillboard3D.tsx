'use client';

import { Text, Billboard, useTexture } from '@react-three/drei';
import { ProjectData } from '@/types';
import { COLORS, FONT_URL } from '@/lib/constants';

interface ProjectBillboard3DProps {
  project: ProjectData;
  position: [number, number, number];
  scale?: number;
}

export default function ProjectBillboard3D({
  project,
  position,
  scale = 1,
}: ProjectBillboard3DProps) {
  const texture = useTexture(project.image);

  const w = 5 * scale;
  const h = 3.5 * scale;

  return (
    <Billboard position={position}>
      {/* Neon frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.2, h + 0.2]} />
        <meshStandardMaterial
          color={project.featured ? COLORS.hotPink : COLORS.deepRose}
          emissive={project.featured ? COLORS.hotPink : COLORS.deepRose}
          emissiveIntensity={project.featured ? 2 : 1}
          toneMapped={false}
        />
      </mesh>

      {/* Dark background */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color="#0d0d1a"
          emissive="#0d0d1a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Screenshot */}
      <mesh position={[0, 0.3 * scale, 0.01]}>
        <planeGeometry args={[w - 0.4, (h - 1.2) * scale]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Project title */}
      <Text
        font={FONT_URL}
        position={[0, -(h / 2 - 0.6 * scale), 0.01]}
        fontSize={0.28 * scale}
        anchorX="center"
        anchorY="middle"
        maxWidth={w - 0.4}
      >
        {project.title}
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </Text>

      {/* Tech stack */}
      <Text
        position={[0, -(h / 2 - 0.25 * scale), 0.01]}
        fontSize={0.16 * scale}
        anchorX="center"
        anchorY="middle"
        maxWidth={w - 0.4}
      >
        {project.tech.join(' • ')}
        <meshStandardMaterial
          color={COLORS.peach}
          emissive={COLORS.peach}
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </Text>
    </Billboard>
  );
}
