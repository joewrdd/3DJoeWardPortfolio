'use client';

import { COLORS } from '@/lib/constants';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZONE_ROAD_INFO } from '@/lib/trackUtils';
import { PROJECTS } from '@/lib/projectData';
import NeonText from '@/components/ui/NeonText';
import ProjectBillboard3D from '@/components/ui/ProjectBillboard3D';

export default function ProjectsZone() {
  const zone = ZONE_DEFINITIONS.find((z) => z.name === 'projects')!;
  const [x, , z] = zone.position;
  const info = ZONE_ROAD_INFO.get('projects')!;

  const featured = PROJECTS.filter((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <group position={[x, 0, z]} rotation={[0, info.roadAngle, 0]}>
      {/* Section title — above the road */}
      <NeonText
        text="PROJECTS"
        position={[0, 8, 0]}
        size={1.4}
        color={COLORS.peach}
        emissiveIntensity={3}
      />

      {/* Featured projects — large roadside billboards, alternating sides */}
      {featured.map((project, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <ProjectBillboard3D
            key={project.id}
            project={project}
            position={[
              -10 + i * 7,
              4.5,
              side * 10,
            ]}
            scale={1.3}
          />
        );
      })}

      {/* Other projects — smaller billboards along both sides further out */}
      {others.map((project, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const xPos = -18 + Math.floor(i / 2) * 7;
        return (
          <ProjectBillboard3D
            key={project.id}
            project={project}
            position={[
              xPos,
              3.5,
              side * 12,
            ]}
            scale={0.9}
          />
        );
      })}

      {/* Single wide overhead zone light */}
      <spotLight
        position={[0, 25, 0]}
        intensity={20}
        angle={1.0}
        penumbra={0.6}
        color={COLORS.peach}
        distance={50}
      />
    </group>
  );
}
