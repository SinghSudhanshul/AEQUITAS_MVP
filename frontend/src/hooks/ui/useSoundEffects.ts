// ============================================
// SOUND EFFECTS HOOK
// Audio Feedback for UI Interactions
// ============================================

import { useCallback, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// ============================================
// TYPES
// ============================================

export type SoundEffectType =
  | 'click'
  | 'success_chord'
  | 'error'
  | 'notification'
  | 'paper_rustle'
  | 'briefcase_close'
  | 'elevator_chime'
  | 'keyboard_clack'
  | 'rank_up'
  | 'achievement'
  | 'xp_gain'
  | 'crisis_alert'
  | 'hover'
  | 'toggle'
  | 'modal_open'
  | 'modal_close';

interface SoundConfig {
  src: string;
  volume: number;
  preload: boolean;
}

// ============================================
// SOUND CONFIGURATION
// ============================================

const SOUNDS: Record<SoundEffectType, SoundConfig> = {
  click: {
    src: '/sounds/click.mp3',
    volume: 0.3,
    preload: true,
  },
  success_chord: {
    src: '/sounds/success.mp3',
    volume: 0.4,
    preload: true,
  },
  error: {
    src: '/sounds/error.mp3',
    volume: 0.4,
    preload: true,
  },
  notification: {
    src: '/sounds/notification.mp3',
    volume: 0.5,
    preload: true,
  },
  paper_rustle: {
    src: '/sounds/paper.mp3',
    volume: 0.2,
    preload: false,
  },
  briefcase_close: {
    src: '/sounds/briefcase.mp3',
    volume: 0.3,
    preload: false,
  },
  elevator_chime: {
    src: '/sounds/chime.mp3',
    volume: 0.4,
    preload: false,
  },
  keyboard_clack: {
    src: '/sounds/keyboard.mp3',
    volume: 0.1,
    preload: false,
  },
  rank_up: {
    src: '/sounds/rank_up.mp3',
    volume: 0.6,
    preload: false,
  },
  achievement: {
    src: '/sounds/achievement.mp3',
    volume: 0.5,
    preload: false,
  },
  xp_gain: {
    src: '/sounds/xp.mp3',
    volume: 0.2,
    preload: true,
  },
  crisis_alert: {
    src: '/sounds/crisis.mp3',
    volume: 0.7,
    preload: true,
  },
  hover: {
    src: '/sounds/hover.mp3',
    volume: 0.1,
    preload: false,
  },
  toggle: {
    src: '/sounds/toggle.mp3',
    volume: 0.2,
    preload: true,
  },
  modal_open: {
    src: '/sounds/modal_open.mp3',
    volume: 0.3,
    preload: true,
  },
  modal_close: {
    src: '/sounds/modal_close.mp3',
    volume: 0.3,
    preload: true,
  },
};

// ============================================
// AUDIO CONTEXT SINGLETON
// ============================================

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// ============================================
// HOOK
// ============================================

interface UseSoundEffectsReturn {
  playSound: (sound: SoundEffectType) => void;
  playSequence: (sounds: SoundEffectType[], delay?: number) => void;
  isEnabled: boolean;
  toggleSounds: () => void;
  preloadSounds: () => void;
}

export function useSoundEffects(): UseSoundEffectsReturn {
  const user = useAuthStore((state) => state.user);
  const updatePreferences = useAuthStore((state) => state.updatePreferences);

  const isEnabled = user?.preferences?.soundEffects ?? true;
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());
  const isPreloaded = useRef(false);

  // ====================================
  // PRELOAD SOUNDS
  // ====================================

  const preloadSounds = useCallback(async () => {
    if (isPreloaded.current || typeof window === 'undefined') return;

    const ctx = getAudioContext();

    const preloadPromises = Object.entries(SOUNDS)
      .filter(([, config]) => config.preload)
      .map(async ([key, config]) => {
        try {
          const response = await fetch(config.src);
          if (!response.ok) return;

          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          audioCache.current.set(key, audioBuffer);
        } catch (error) {
          // Silently fail - sound is optional
          console.debug(`Failed to preload sound: ${key}`);
        }
      });

    await Promise.all(preloadPromises);
    isPreloaded.current = true;
  }, []);

  // Preload on mount
  useEffect(() => {
    if (isEnabled) {
      preloadSounds();
    }
  }, [isEnabled, preloadSounds]);

  // ====================================
  // PLAY SOUND
  // ====================================

  const playSound = useCallback(async (sound: SoundEffectType) => {
    if (!isEnabled || typeof window === 'undefined') return;

    const config = SOUNDS[sound];
    if (!config) return;

    try {
      const ctx = getAudioContext();

      // Resume audio context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Check cache first
      let audioBuffer = audioCache.current.get(sound);

      if (!audioBuffer) {
        // Load on demand
        const response = await fetch(config.src);
        if (!response.ok) {
          // Fallback: Use oscillator for simple feedback
          playSyntheticSound(ctx, sound, config.volume);
          return;
        }

        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        audioCache.current.set(sound, audioBuffer);
      }

      // Create and play source
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = ctx.createGain();
      gainNode.gain.value = config.volume;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
    } catch (error) {
      // Silently fail - sound effects are enhancement, not critical
      console.debug('Sound playback failed:', error);
    }
  }, [isEnabled]);

  // ====================================
  // PLAY SOUND SEQUENCE
  // ====================================

  const playSequence = useCallback((sounds: SoundEffectType[], delay = 200) => {
    sounds.forEach((sound, index) => {
      setTimeout(() => {
        playSound(sound);
      }, index * delay);
    });
  }, [playSound]);

  // ====================================
  // TOGGLE SOUNDS
  // ====================================

  const toggleSounds = useCallback(() => {
    updatePreferences({ soundEffects: !isEnabled });
  }, [isEnabled, updatePreferences]);

  return {
    playSound,
    playSequence,
    isEnabled,
    toggleSounds,
    preloadSounds,
  };
}

// ============================================
// SYNTHETIC SOUND FALLBACK
// ============================================

function playSyntheticSound(
  ctx: AudioContext,
  type: SoundEffectType,
  volume: number
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Configure based on sound type
  switch (type) {
    case 'click':
    case 'hover':
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = volume * 0.1;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
      break;

    case 'success_chord':
    case 'achievement':
    case 'rank_up':
      oscillator.frequency.value = 523.25; // C5
      oscillator.type = 'sine';
      gainNode.gain.value = volume * 0.15;
      oscillator.start();

      // Play chord
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        osc2.frequency.value = 659.25; // E5
        osc2.type = 'sine';
        osc2.connect(gainNode);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      }, 100);

      oscillator.stop(ctx.currentTime + 0.3);
      break;

    case 'error':
    case 'crisis_alert':
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.value = volume * 0.1;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
      break;

    case 'notification':
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      gainNode.gain.value = volume * 0.1;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
      break;

    default:
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.value = volume * 0.05;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
  }
}

// ============================================
// EXPORTS
// ============================================

export default useSoundEffects;
