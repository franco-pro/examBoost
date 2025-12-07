import { playSound, stopSound } from '../helper/audio/audio.manager';
export function useSoundAud() {
  return {
    play: playSound,
    stop: stopSound
  };
}