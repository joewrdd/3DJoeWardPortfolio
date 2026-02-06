'use client';

import { useGameStore } from '@/store/useGameStore';
import { AnimatePresence, motion } from 'framer-motion';
import StartPrompt from './StartPrompt';
import MobileControls from './MobileControls';
import ZoneCompass from './ZoneCompass';

export default function HUD() {
  const currentZone = useGameStore((s) => s.currentZone);
  const speed = useGameStore((s) => s.speed);
  const isLoaded = useGameStore((s) => s.isLoaded);
  const isStarted = useGameStore((s) => s.isStarted);
  const isMobile = useGameStore((s) => s.isMobile);

  if (!isLoaded) return null;

  const zoneLabelMap: Record<string, string> = {
    home: 'HOME',
    about: 'ABOUT',
    skills: 'SKILLS',
    projects: 'PROJECTS',
    journey: 'JOURNEY',
    contact: 'CONTACT',
  };

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Top-left branding */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <h2
          className="text-lg md:text-xl font-bold tracking-widest"
          style={{ color: '#e01e5a' }}
        >
          JOE WARD
        </h2>
        <p className="text-[10px] md:text-xs text-white/40 font-mono tracking-wider">
          PORTFOLIO
        </p>
      </div>

      {/* Top-right zone name */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-right">
        <AnimatePresence mode="wait">
          {currentZone && (
            <motion.div
              key={currentZone}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-white/40 font-mono">ZONE</p>
              <h3
                className="text-xl md:text-2xl font-bold tracking-wider"
                style={{ color: '#ff6f61' }}
              >
                {zoneLabelMap[currentZone] || ''}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom center - speed + controls hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        {isStarted && (
          <div className="font-mono text-white/60 text-sm">
            <span className="text-2xl font-bold text-white/80">
              {Math.round(speed)}
            </span>
            <span className="text-xs ml-1">KM/H</span>
          </div>
        )}
      </div>

      {/* Start prompt */}
      {!isStarted && <StartPrompt />}

      {/* Zone compass */}
      {isStarted && <ZoneCompass />}

      {/* Mobile controls */}
      {isMobile && isStarted && <MobileControls />}
    </div>
  );
}
