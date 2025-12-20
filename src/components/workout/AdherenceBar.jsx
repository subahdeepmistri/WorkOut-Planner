import React from 'react';

export const AdherenceBar = ({ targetVolume, actualVolume, isSkipped = false, label = "Adherence", height = "h-2", missedContext }) => {
    // Safety check for division by zero
    const safeTarget = targetVolume || 1;
    const rawPercentage = (actualVolume / safeTarget) * 100;

    // Cap visual bar at 100, but logic handles Overdrive
    const visualPercentage = Math.min(100, Math.max(0, rawPercentage));
    const isOverdrive = rawPercentage > 100;
    const isSuccess = rawPercentage >= 100;
    const isPartial = rawPercentage > 0 && rawPercentage < 100;

    // Adherence 2.0 Logic
    let barColor = 'bg-zinc-300 dark:bg-zinc-700'; // Default (0%)
    let shadow = '';

    if (isOverdrive) {
        barColor = 'bg-purple-500';
        shadow = 'shadow-[0_0_15px_rgba(168,85,247,0.6)]'; // Purple Haze
    } else if (rawPercentage >= 100) {
        barColor = 'bg-emerald-500';
        shadow = 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'; // Perfect
    } else if (rawPercentage >= 80) {
        barColor = 'bg-emerald-400'; // High Adherence
    } else if (rawPercentage >= 50) {
        barColor = 'bg-yellow-400'; // Energized
    } else if (rawPercentage > 0) {
        barColor = 'bg-zinc-500 dark:bg-zinc-600'; // Started (Neutral)
    } else if (isSkipped) {
        barColor = 'bg-red-500/30';
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isOverdrive ? 'text-cyan-600 dark:text-cyan-400 animate-pulse' : 'text-zinc-600 dark:text-zinc-500'}`}>
                    {label} {isOverdrive && "⚡"}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span className={isOverdrive ? 'text-cyan-600 dark:text-cyan-400 font-bold' : isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-300'}>
                        {Math.round(rawPercentage)}%
                    </span>
                    {targetVolume > 0 && <span className="text-zinc-400 dark:text-zinc-600 ml-1">/ 100%</span>}
                </span>
            </div>

            {/* The "Ghost Bar" (Layer 1) */}
            <div className={`w-full ${height} bg-zinc-100 dark:bg-zinc-800/80 rounded-md overflow-hidden border-2 border-zinc-300 dark:border-zinc-700/30 relative`}>

                {/* Skipped Indicator (Layer 2 - Special) */}
                {isSkipped && rawPercentage === 0 && (
                    <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                        <div className="w-full h-px bg-red-500/50 transform rotate-3"></div>
                    </div>
                )}

                {/* The Actual Bar (Layer 2) */}
                <div
                    className={`h-full rounded-md transition-all duration-700 ease-out ${barColor} ${shadow}`}
                    style={{ width: `${visualPercentage}%` }}
                >
                    {/* Optional: Add internal shine or texture for premium feel */}
                </div>
            </div>

            {/* Layer 3: Missed Gap Context (Text) */}
            {isPartial && !isSkipped && (
                <div className="text-[9px] text-blue-500/80 dark:text-amber-500/80 mt-1 text-right font-medium">
                    {missedContext || `${Math.round(100 - rawPercentage)}% gap`}
                </div>
            )}
        </div>
    );
};
