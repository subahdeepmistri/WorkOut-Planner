import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export const WorkoutTimer = ({ startTime, endTime, className = "" }) => {
    const [elapsed, setElapsed] = useState('00:00');

    useEffect(() => {
        // If finished (endTime exists) or not started, show 00:00
        if (!startTime || endTime) {
            setElapsed('00:00');
            return;
        }

        const updateTime = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((now - startTime) / 1000));

            const m = Math.floor(diff / 60);
            const s = diff % 60;

            setElapsed(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        // Initial update
        updateTime();

        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [startTime, endTime]);

    const isVerifiedActive = !!startTime && !endTime;

    // determine styles based on state
    // Active: Emerald
    // Not Started/Finished: Zinc (inactive)
    // Active: Emerald
    const activeStyles = "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
    const inactiveStyles = "bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500";

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono font-bold transition-all duration-300 ${isVerifiedActive ? activeStyles : inactiveStyles} ${className}`}>
            <Timer size={14} className={isVerifiedActive ? "animate-pulse" : ""} />
            {elapsed}
        </div>
    );
};
