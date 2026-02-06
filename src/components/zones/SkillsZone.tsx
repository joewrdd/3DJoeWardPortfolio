'use client';

import { Text, Billboard } from '@react-three/drei';
import { COLORS, FONT_URL } from '@/lib/constants';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZONE_ROAD_INFO } from '@/lib/trackUtils';
import { SKILLS, SKILL_CATEGORIES } from '@/lib/skillsData';
import { SkillCategory } from '@/types';
import NeonText from '@/components/ui/NeonText';
import SkillCard3D from '@/components/ui/SkillCard3D';

export default function SkillsZone() {
  const zone = ZONE_DEFINITIONS.find((z) => z.name === 'skills')!;
  const [x, , z] = zone.position;
  const info = ZONE_ROAD_INFO.get('skills')!;

  const categories = Object.keys(SKILL_CATEGORIES) as SkillCategory[];

  return (
    <group position={[x, 0, z]} rotation={[0, info.roadAngle, 0]}>
      {/* Section title */}
      <NeonText
        text="SKILLS"
        position={[0, 12, 14]}
        size={1.2}
        color="#00d4ff"
        emissiveIntensity={3}
      />

      {/* 6 categories as columns spread along X (road direction) */}
      {categories.map((cat, catIndex) => {
        const catSkills = SKILLS.filter((s) => s.category === cat);
        const catInfo = SKILL_CATEGORIES[cat];
        // 6 columns spread from -12.5 to +12.5 (5-unit spacing)
        const colX = -12.5 + catIndex * 5;

        return (
          <group key={cat} position={[colX, 0, 14]}>
            {/* Category label above the column */}
            <Billboard position={[0, 10, 0]}>
              <Text
                font={FONT_URL}
                fontSize={0.3}
                color={catInfo.color}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.01}
                outlineColor={catInfo.color}
              >
                {catInfo.label}
              </Text>
            </Billboard>

            {/* Cards stacked vertically within the column */}
            {catSkills.map((skill, i) => (
              <SkillCard3D
                key={skill.name}
                skill={skill}
                position={[0, 7.5 - i * 3.2, 0]}
                categoryColor={catInfo.color}
              />
            ))}
          </group>
        );
      })}

      {/* Zone light — single wide spotlight */}
      <spotLight
        position={[0, 25, 10]}
        intensity={20}
        angle={1.0}
        penumbra={0.6}
        color="#00d4ff"
        distance={50}
      />
    </group>
  );
}
