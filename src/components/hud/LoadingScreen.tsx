'use client';

import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';

export default function LoadingScreen() {
  const { progress, loaded, total } = useProgress();
  const isLoaded = useGameStore((s) => s.isLoaded);
  const setIsLoaded = useGameStore((s) => s.setIsLoaded);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, setIsLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-8"
            style={{ color: '#e01e5a' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            JOE WARD
          </motion.h1>

          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #e01e5a, #ff6f61, #ffd1a9)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <p className="text-white/50 text-sm font-mono">
            {Math.round(progress)}% loaded
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
