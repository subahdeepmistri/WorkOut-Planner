
import React, { useEffect, useState } from 'react';

/**
 * SplitEnergyBars - Analytics Stacked Bars
 * 
 * Visualization:
 * - Stacked horizontal bars (Energy Gauge Concept)
 * - Animated widths
 * - Percentage labels at ends
 * - Interaction: Expand to show counts
 */
export const SplitEnergyBars = ({ distribution, totalWorkouts, theme }) => {
    // distribution: [Strength, Cardio, Core]
    const [s, c, a] = distribution;
    const total = totalWorkouts || 1;

    // Percentages
    const sPct = (s / total) * 100;
    const cPct = (c / total) * 100;
    const aPct = (a / total) * 100;

    // Animation & Interaction
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState(null); // 's', 'c', 'a', or null

    useEffect(() => {
        // Trigger generic entrance
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Helper for Bar Row
    const renderBar = (label, pct, count, color, shadowColor, delay, id) => {
        const isActive = active === id;

        return (
            <div
                className={`flex items-center gap-3 group cursor-pointer select-none`}
                onClick={() => setActive(isActive ? null : id)}
                onMouseEnter={() => setActive(id)}
                onMouseLeave={() => setActive(null)}
            >
                {/* Checkbox-like Label? No, strict "Strength" text */}
                <span className={`w-16 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition-colors duration-300 ${isActive ? 'text-zinc-800 dark:text-zinc-200' : ''}`}>
                    {label}
                </span>

                {/* Track */}
                <div className="flex-grow h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative transition-all duration-300 transform origin-left">
                    {/* Fill */}
                    <div
                        className={`h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out`}
                        style={{
                            width: mounted ? `${pct}%` : '0%',
                            backgroundColor: color,
                            boxShadow: isActive ? `0 0 12px ${shadowColor}` : `0 0 5px ${shadowColor.replace('0.5', '0.2')}`,
                            transitionDelay: `${delay}ms`
                        }}
                    >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-50"></div>
                    </div>
                </div>

                {/* Value (Percent vs Count) */}
                <div className="w-12 text-right relative h-4 overflow-visible">
                    {/* Percentage */}
                    <span
                        className={`absolute right-0 text-xs font-bold transition-all duration-500 transform ${isActive ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
                        style={{
                            color: color,
                            transitionDelay: mounted ? `${delay + 500}ms` : '0ms' // Slide up AFTER bar fills
                        }}
                    >
                        {Math.round(pct)}%
                    </span>

                    {/* Count (Revealed on Active) */}
                    <span
                        className={`absolute right-0 text-xs font-bold text-zinc-800 dark:text-white transition-all duration-300 transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    >
                        {count} <span className="text-[9px] opacity-60">Sess</span>
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-3 py-2">
            {renderBar('Strength', sPct, s, '#6366f1', 'rgba(99,102,241,0.5)', 0, 's')}
            {renderBar('Cardio', cPct, c, '#ec4899', 'rgba(236,72,153,0.5)', 200, 'c')}
            {renderBar('Core', aPct, a, '#10b981', 'rgba(16,185,129,0.5)', 400, 'a')}
        </div>
    );
};
