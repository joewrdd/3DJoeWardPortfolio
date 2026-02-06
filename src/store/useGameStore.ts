import { create } from 'zustand';
import { GameStore } from '@/types';

export const useGameStore = create<GameStore>((set) => ({
  currentZone: null,
  speed: 0,
  controlsInput: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  },
  isMobile: false,
  audioEnabled: false,
  isLoaded: false,
  isStarted: false,
  carPosition: [0, 2, 5],
  carRotation: [0, 0, 0, 1],

  setCurrentZone: (zone) => set({ currentZone: zone }),
  setSpeed: (speed) => set({ speed }),
  setControlsInput: (input) =>
    set((state) => ({
      controlsInput: { ...state.controlsInput, ...input },
    })),
  setIsMobile: (isMobile) => set({ isMobile }),
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setIsStarted: (started) => set({ isStarted: started }),
  setCarPosition: (pos) => set({ carPosition: pos }),
  setCarRotation: (rot) => set({ carRotation: rot }),
}));
