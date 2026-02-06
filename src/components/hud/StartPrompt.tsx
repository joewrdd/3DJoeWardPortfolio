'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export default function StartPrompt() {
  const isMobile = useGameStore((s) => s.isMobile);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-white/70 text-lg md:text-xl font-mono">
          {isMobile ? 'TAP TO DRIVE' : 'PRESS WASD TO DRIVE'}
        </p>
        <p className="text-white/30 text-xs mt-2 font-mono">
          {isMobile ? 'Use joystick to steer' : 'WASD / Arrows to steer • Space to brake'}
        </p>
      </motion.div>
    </motion.div>
  );
}
