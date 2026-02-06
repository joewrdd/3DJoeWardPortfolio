'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/hud/LoadingScreen';
import HUD from '@/components/hud/HUD';

const Experience = dynamic(() => import('@/components/canvas/Experience'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
      <HUD />
      <LoadingScreen />
    </main>
  );
}
