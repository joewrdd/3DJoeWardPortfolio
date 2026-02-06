import { ZoneDefinition } from '@/types';
import { COLORS } from './constants';

// Zone positions are placed along the track at key locations
// Each zone has a sensor collider size for detection
export const ZONE_DEFINITIONS: ZoneDefinition[] = [
  {
    name: 'home',
    label: 'HOME',
    position: [0, 0, 0],
    size: [40, 10, 30],
    color: COLORS.hotPink,
  },
  {
    name: 'about',
    label: 'ABOUT',
    position: [105, 0, 35],
    size: [40, 10, 40],
    color: COLORS.coral,
  },
  {
    name: 'skills',
    label: 'SKILLS',
    position: [50, 0, 95],
    size: [50, 10, 30],
    color: COLORS.neonBlue,
  },
  {
    name: 'projects',
    label: 'PROJECTS',
    position: [-30, 0, 105],
    size: [50, 10, 30],
    color: COLORS.peach,
  },
  {
    name: 'journey',
    label: 'JOURNEY',
    position: [-70, 0, 40],
    size: [30, 10, 40],
    color: COLORS.deepRose,
  },
  {
    name: 'contact',
    label: 'CONTACT',
    position: [-40, 0, -10],
    size: [40, 10, 30],
    color: COLORS.hotPink,
  },
];
