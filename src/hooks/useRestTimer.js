import { useState, useEffect, useCallback } from 'react';
import { useAudio } from './useAudio';

/**
 * useRestTimer Hook
 * Manages the countdown timer state and triggers audio on completion.
 */
export const useRestTimer = () => {
    const [timerState, setTimerState] = useState({ isActive: false, timeLeft: 0 });
    const { playAlert } = useAudio();

    // Tick Logic
    useEffect(() => {
        let interval;
        if (timerState.isActive && timerState.timeLeft > 0) {
            interval = setInterval(() => {
                setTimerState(prev => {
                    if (prev.timeLeft <= 1) {
                        playAlert(); // Trigger Audio Hook
                        return { isActive: false, timeLeft: 0 };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        } else if (timerState.timeLeft === 0) {
            setTimerState(prev => ({ ...prev, isActive: false }));
        }
        return () => clearInterval(interval);
    }, [timerState.isActive, timerState.timeLeft, playAlert]);

    // Actions
    const startTimer = useCallback((duration) => {
        setTimerState({ isActive: true, timeLeft: duration });
    }, []);

    const adjustTime = useCallback((amount) => {
        setTimerState(prev => ({
            ...prev,
            timeLeft: Math.max(0, prev.timeLeft + amount)
        }));
    }, []);

    const stopTimer = useCallback(() => {
        setTimerState({ isActive: false, timeLeft: 0 });
    }, []);

    return {
        isActive: timerState.isActive,
        timeLeft: timerState.timeLeft,
        startTimer,
        adjustTime,
        stopTimer
    };
};
