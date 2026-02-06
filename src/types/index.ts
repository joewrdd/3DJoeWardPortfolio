export type ZoneName =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "journey"
  | "contact";

export interface ZoneDefinition {
  name: ZoneName;
  label: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  featured: boolean;
  link?: string;
  github?: string;
}

export interface SkillData {
  name: string;
  icon: string;
  category: SkillCategory;
  level: number; // 0-1
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "database"
  | "devops"
  | "ai";

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface ControlsInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export interface GameStore {
  currentZone: ZoneName | null;
  speed: number;
  controlsInput: ControlsInput;
  isMobile: boolean;
  audioEnabled: boolean;
  isLoaded: boolean;
  isStarted: boolean;
  carPosition: [number, number, number];
  carRotation: [number, number, number, number];
  setCurrentZone: (zone: ZoneName | null) => void;
  setSpeed: (speed: number) => void;
  setControlsInput: (input: Partial<ControlsInput>) => void;
  setIsMobile: (isMobile: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setIsLoaded: (loaded: boolean) => void;
  setIsStarted: (started: boolean) => void;
  setCarPosition: (pos: [number, number, number]) => void;
  setCarRotation: (rot: [number, number, number, number]) => void;
}
