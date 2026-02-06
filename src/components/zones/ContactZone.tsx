'use client';

import { Text, Html, Billboard } from '@react-three/drei';
import { COLORS, FONT_URL } from '@/lib/constants';
import { ZONE_DEFINITIONS } from '@/lib/zoneDefinitions';
import { ZONE_ROAD_INFO } from '@/lib/trackUtils';
import NeonText from '@/components/ui/NeonText';
import Badge3D from '@/components/ui/Badge3D';

export default function ContactZone() {
  const zone = ZONE_DEFINITIONS.find((z) => z.name === 'contact')!;
  const [x, , z] = zone.position;
  const info = ZONE_ROAD_INFO.get('contact')!;

  return (
    <group position={[x, 0, z]} rotation={[0, info.roadAngle, 0]}>
      {/* Section title */}
      <NeonText
        text="CONTACT"
        position={[0, 8, 14]}
        size={1.2}
        color={COLORS.hotPink}
        emissiveIntensity={4}
      />

      {/* Checkered finish line on ground at Z=10 */}
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 4 }).map((_, j) => (
          <mesh
            key={`check-${i}-${j}`}
            position={[-7 + i * 2, 0.02, 8 + j * 2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial
              color={(i + j) % 2 === 0 ? '#ffffff' : '#000000'}
              emissive={(i + j) % 2 === 0 ? '#ffffff' : '#000000'}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))
      )}

      {/* Contact info */}
      <Billboard position={[0, 7, 14]}>
        <Text
          font={FONT_URL}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={12}
          lineHeight={1.8}
          textAlign="center"
        >
          {`Let's work together!\n\nEmail: joewrrd@gmail.com\nGitHub: github.com/joewrrd`}
        </Text>
      </Billboard>

      {/* Social badges — spread along X at Z=13 */}
      <Badge3D label="GitHub" position={[-4, 3.5, 13]} color={COLORS.coral} />
      <Badge3D label="LinkedIn" position={[0, 3.5, 13]} color={COLORS.hotPink} />
      <Badge3D label="Email" position={[4, 3.5, 13]} color={COLORS.peach} />

      {/* CV Download link */}
      <Html position={[0, 2, 13]} center transform distanceFactor={10}>
        <a
          href="/data/JoeWardCV.pdf"
          download
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #e01e5a, #ff6f61)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            border: '2px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          DOWNLOAD CV
        </a>
      </Html>

      {/* Stats */}
      <group position={[0, 1, 14]}>
        <Badge3D label="14+ Projects" position={[-4, 0, 0]} color={COLORS.coral} />
        <Badge3D label="48+ Skills" position={[0, 0, 0]} color={COLORS.hotPink} />
        <Badge3D label="4+ Years" position={[4, 0, 0]} color={COLORS.peach} />
      </group>

      {/* Zone spotlight */}
      <spotLight
        position={[0, 20, 8]}
        intensity={15}
        angle={0.7}
        penumbra={0.5}
        color={COLORS.hotPink}
        distance={40}
      />
    </group>
  );
}
