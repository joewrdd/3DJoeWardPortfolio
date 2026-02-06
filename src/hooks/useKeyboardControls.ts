'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useKeyboardControls() {
  const setControlsInput = useGameStore((s) => s.setControlsInput);
  const setIsStarted = useGameStore((s) => s.setIsStarted);
  const isStarted = useGameStore((s) => s.isStarted);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted) {
        if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          setIsStarted(true);
        }
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControlsInput({ forward: true });
          break;
        case 's':
        case 'arrowdown':
          setControlsInput({ backward: true });
          break;
        case 'a':
        case 'arrowleft':
          setControlsInput({ left: true });
          break;
        case 'd':
        case 'arrowright':
          setControlsInput({ right: true });
          break;
        case ' ':
          setControlsInput({ brake: true });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControlsInput({ forward: false });
          break;
        case 's':
        case 'arrowdown':
          setControlsInput({ backward: false });
          break;
        case 'a':
        case 'arrowleft':
          setControlsInput({ left: false });
          break;
        case 'd':
        case 'arrowright':
          setControlsInput({ right: false });
          break;
        case ' ':
          setControlsInput({ brake: false });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setControlsInput, setIsStarted, isStarted]);
}
