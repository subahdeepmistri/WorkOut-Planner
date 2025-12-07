import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './useAudio';

export const useRestTimer = () => {
    const [targetTime, setTargetTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeContext, setActiveContext] = useState(null); // Tracks which exercise (index) is active
    const { playAlert } = useAudio();

    // We use a ref to prevent audio playing multiple times for the same completion
    const hasPlayedAudioRef = useRef(false);

    useEffect(() => {
        if (!targetTime) {
            setIsActive(false);
            setTimeLeft(0);
            return;
        }

        setIsActive(true);
        hasPlayedAudioRef.current = false; // Reset audio flag on new start

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.ceil((targetTime - now) / 1000);

            if (remaining <= 0) {
                setTimeLeft(0);
                setIsActive(false);
                setTargetTime(null);
                setActiveContext(null); // Clear context on finish

                // Play Audio once
                if (!hasPlayedAudioRef.current) {
                    playAlert();
                    hasPlayedAudioRef.current = true;
                }
            } else {
                setTimeLeft(remaining);
            }
        }, 200); // Check more frequently than 1s for responsiveness

        return () => clearInterval(interval);
    }, [targetTime, playAlert]);

    const startRest = useCallback((seconds, contextId) => {
        const now = Date.now();
        setTargetTime(now + (seconds * 1000));
        setTimeLeft(seconds);
        setIsActive(true);
        setActiveContext(contextId);
    }, []);

    const addTime = useCallback((seconds) => {
        setTargetTime(prev => {
            if (!prev) {
                // If timer wasn't running, start it
                return Date.now() + (seconds * 1000);
            }
            return prev + (seconds * 1000);
        });
    }, []);

    const stopRest = useCallback(() => {
        setTargetTime(null);
        setIsActive(false);
        setTimeLeft(0);
        setActiveContext(null);
    }, []);

    return {
        isActive,
        timeLeft,
        activeContext,
        startRest,
        addTime,
        stopRest
    };
};
