'use client';

import { useCallback } from 'react';

/**
 * Sound effect types
 */
export type SoundEffect =
  | 'success'
  | 'error'
  | 'warning'
  | 'notification'
  | 'click'
  | 'achievement'
  | 'level_up'
  | 'crisis_alert'
  | 'message';

/**
 * Hook for playing sound effects
 * Currently a stub implementation - can be connected to actual audio system
 */
export function useSoundEffects() {
  const playSound = useCallback((sound: SoundEffect) => {
    // Stub implementation - in production, this would play actual audio
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug(`[SoundEffect] Playing: ${sound}`);
    }
  }, []);

  const stopSound = useCallback((sound: SoundEffect) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug(`[SoundEffect] Stopping: ${sound}`);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug(`[SoundEffect] Volume set to: ${volume}`);
    }
  }, []);

  return {
    playSound,
    stopSound,
    setVolume,
    isEnabled: true,
    toggleEnabled: () => { },
  };
}

export default useSoundEffects;
