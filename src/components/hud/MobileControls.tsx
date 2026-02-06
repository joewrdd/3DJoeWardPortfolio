'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function MobileControls() {
  const joystickRef = useRef<HTMLDivElement>(null);
  const brakeRef = useRef<HTMLButtonElement>(null);
  const setControlsInput = useGameStore((s) => s.setControlsInput);
  const nippleManagerRef = useRef<any>(null);

  useEffect(() => {
    if (!joystickRef.current) return;

    let nipplejs: any;
    import('nipplejs').then((mod) => {
      nipplejs = mod.default || mod;
      if (!joystickRef.current) return;

      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '80px', bottom: '80px' },
        color: '#e01e5a',
        size: 120,
      });

      nippleManagerRef.current = manager;

      manager.on('move', (_: any, data: any) => {
        const angle = data.angle?.degree || 0;
        const force = Math.min(data.force || 0, 1);

        const forward = angle > 30 && angle < 150;
        const backward = angle > 210 && angle < 330;
        const left = angle > 120 && angle < 240;
        const right = angle > 300 || angle < 60;

        setControlsInput({
          forward: forward && force > 0.3,
          backward: backward && force > 0.3,
          left: left && force > 0.3,
          right: right && force > 0.3,
        });
      });

      manager.on('end', () => {
        setControlsInput({
          forward: false,
          backward: false,
          left: false,
          right: false,
        });
      });
    });

    return () => {
      if (nippleManagerRef.current) {
        nippleManagerRef.current.destroy();
      }
    };
  }, [setControlsInput]);

  return (
    <>
      <div
        ref={joystickRef}
        className="fixed bottom-0 left-0 w-[200px] h-[200px] pointer-events-auto z-20"
      />
      <button
        ref={brakeRef}
        className="fixed bottom-16 right-8 w-16 h-16 rounded-full border-2 pointer-events-auto z-20 flex items-center justify-center font-mono text-sm font-bold active:scale-95 transition-transform"
        style={{
          borderColor: '#e01e5a',
          color: '#e01e5a',
          backgroundColor: 'rgba(224, 30, 90, 0.1)',
        }}
        onTouchStart={() => setControlsInput({ brake: true })}
        onTouchEnd={() => setControlsInput({ brake: false })}
      >
        BRAKE
      </button>
    </>
  );
}
