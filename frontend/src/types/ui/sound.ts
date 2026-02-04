// ============================================
// SOUND TYPES
// Audio & Sound Effects
// ============================================

/**
 * Sound effect identifiers
 */
export type SoundEffectId =
  | 'click'
  | 'success'
  | 'error'
  | 'warning'
  | 'notification'
  | 'achievement'
  | 'levelUp'
  | 'rankUp'
  | 'prestige'
  | 'crisis'
  | 'glassClink'
  | 'paperRustle'
  | 'keyboardClick'
  | 'elevatorChime'
  | 'successChord';

/**
 * Sound categories
 */
export type SoundCategory =
  | 'ui'           // UI interactions
  | 'notification' // Alerts and notifications
  | 'gamification' // XP, achievements, etc.
  | 'ambient'      // Background soundscapes
  | 'persona';     // Harvey/Donna sounds

/**
 * Sound effect definition
 */
export interface SoundEffect {
  id: SoundEffectId;
  name: string;
  category: SoundCategory;
  src: string;
  volume: number;
  duration: number;
  preload: boolean;
}

/**
 * Sound settings
 */
export interface SoundSettings {
  enabled: boolean;
  masterVolume: number; // 0-1
  categoryVolumes: Record<SoundCategory, number>;
  muteDuringQuietHours: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

/**
 * Soundscape (ambient audio)
 */
export interface Soundscape {
  id: string;
  name: string;
  description: string;
  tracks: SoundscapeTrack[];
  mood: string;
  harveyApproved: boolean;
}

/**
 * Soundscape track
 */
export interface SoundscapeTrack {
  src: string;
  volume: number;
  loop: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
}

/**
 * Audio player state
 */
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack?: string;
  currentVolume: number;
  isMuted: boolean;
  queue: string[];
}

/**
 * Sound trigger event
 */
export interface SoundTriggerEvent {
  soundId: SoundEffectId;
  timestamp: number;
  source: string;
  context?: Record<string, unknown>;
}

/**
 * Sound manager interface
 */
export interface SoundManager {
  play: (soundId: SoundEffectId) => void;
  playWithVolume: (soundId: SoundEffectId, volume: number) => void;
  stop: (soundId: SoundEffectId) => void;
  stopAll: () => void;
  setMasterVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  preloadAll: () => Promise<void>;
}
