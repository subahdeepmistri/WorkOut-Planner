import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './useAudio';

export const useRestTimer = ({ onComplete } = {}) => {
    const [targetTime, setTargetTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeContext, setActiveContext] = useState(null); // Tracks which exercise (index) is active
    const { playAlert } = useAudio();

    // We use a ref to prevent audio playing multiple times for the same completion
    const hasPlayedAudioRef = useRef(false);

    const [totalDuration, setTotalDuration] = useState(0); // For progress ring calculation

    // ... (refs)

    useEffect(() => {
        if (!targetTime) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
                setTotalDuration(0);
                const finishedContext = activeContext; // Capture context before clearing
                setActiveContext(null); // Clear context on finish

                // Play Audio once
                if (!hasPlayedAudioRef.current) {
                    playAlert();
                    // Vibration API
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                    hasPlayedAudioRef.current = true;
                }

                // Trigger callback
                if (onComplete) onComplete(finishedContext);
            } else {
                setTimeLeft(remaining);
            }
        }, 200); // Check more frequently than 1s for responsiveness

        return () => clearInterval(interval);
    }, [targetTime, playAlert, onComplete, activeContext]);

    const startRest = useCallback((seconds, contextId) => {
        const now = Date.now();
        setTargetTime(now + (seconds * 1000));
        setTimeLeft(seconds);
        setTotalDuration(seconds); // Set initial total
        setIsActive(true);
        setActiveContext(contextId);
        // Haptic feedback on start
        if (navigator.vibrate) navigator.vibrate(50);
    }, []);

    const addTime = useCallback((seconds) => {
        setTargetTime(prev => {
            if (!prev) {
                // If timer wasn't running, start it
                setTotalDuration(seconds);
                return Date.now() + (seconds * 1000);
            }
            return prev + (seconds * 1000);
        });
        // Optionally update totalDuration contextually, but simplest is to just let timeLeft exceed original total or update total?
        // Let's update totalDuration to match the new reality so the ring doesn't look broken (e.g. > 100%)
        setTotalDuration(prev => prev + seconds);
    }, []);

    const stopRest = useCallback(() => {
        setTargetTime(null);
        setIsActive(false);
        setTimeLeft(0);
        setTotalDuration(0);
        setActiveContext(null);
        if (navigator.vibrate) navigator.vibrate(50);
    }, []);

    const subtractTime = useCallback((seconds) => {
        setTargetTime(prev => {
            if (!prev) return null;
            return prev - (seconds * 1000);
        });
        setTotalDuration(prev => Math.max(0, prev - seconds));
    }, []);

    return {
        isActive,
        timeLeft,
        totalDuration,
        activeContext,
        startRest,
        addTime,
        subtractTime,
        stopRest
    };
};
