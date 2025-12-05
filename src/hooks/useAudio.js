import { useRef, useCallback } from 'react';

/**
 * useAudio Hook
 * Manages audio playback with fallback to Web Audio API loop if file fails.
 * Designed for system alerts like timer completion.
 */
export const useAudio = () => {
    const audioContextRef = useRef(null);

    const playAlert = useCallback(() => {
        // 1. Try to play File (if we ever successfully download one)
        const audio = new Audio('/alarm.mp3');

        const playFile = async () => {
            try {
                await audio.play();
            } catch (e) {
                // Fallback to Oscillator if file fails (or doesn't exist)
                playOscillatorFallback();
            }
        };

        playFile();
    }, []);

    const playOscillatorFallback = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // "Digital Watch" Double Beep
            const now = ctx.currentTime;

            // Beep 1
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);

            // Beep 2
            osc.frequency.setValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0, now + 0.15);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {
            console.error("Audio fallback failed", e);
        }
    };

    return { playAlert };
};
