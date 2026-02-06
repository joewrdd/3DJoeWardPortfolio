'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useIsMobile() {
  const setIsMobile = useGameStore((s) => s.setIsMobile);

  useEffect(() => {
    const check = () => {
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice && isSmallScreen);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setIsMobile]);
}
