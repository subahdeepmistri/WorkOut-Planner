import React, { useEffect, useState } from 'react';

/**
 * RadialSplit - Dashboard Radial Progress Ring
 * 
 * Visualization:
 * - 360 ring segmented by distribution
 * - Center Summary
 * - Glowing segments
 * - Premium Micro-Animations
 */
export const RadialSplit = ({ distribution, totalWorkouts, theme }) => {
    // distribution: [Strength, Cardio, Core]
    const [s, c, a] = distribution;

    // Animation States
    const [mounted, setMounted] = useState(false);
    const [hoveredSeg, setHoveredSeg] = useState(null);
    const [displayCount, setDisplayCount] = useState(0);

    // Calculate Percentages
    const total = totalWorkouts || 1;
    const sPct = (s / total) * 100;
    const cPct = (c / total) * 100;
    const aPct = (a / total) * 100;

    // Radius & Circumference
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    // Trigger Animations on Mount
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);

        // Count Up Animation
        let start = 0;
        const end = totalWorkouts || 0;

        // If changing end dynamically, handle it
        if (end === 0) return;

        const duration = 1500;
        const startTime = performance.now();

        const animateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // EaseOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setDisplayCount(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };
        requestAnimationFrame(animateCount);

        return () => clearTimeout(timer);
    }, [totalWorkouts]);

    // Helper for interactive segments
    const getSegmentProps = (val, pct, color, shadowColor, rotationOffset, delay, type) => {
        const isActive = hoveredSeg === type;
        const targetOffset = circumference - ((pct / 100) * circumference);

        return {
            cx: "80", cy: "80", r: radius,
            fill: "none",
            stroke: color,
            strokeWidth: isActive ? "14" : "12", // Expand on hover
            strokeDasharray: circumference,
            strokeDashoffset: mounted ? targetOffset : circumference, // Animate from empty
            strokeLinecap: "round",
            className: `cursor-pointer transition-all duration-500 ease-out origin-center hover:opacity-100 ${hoveredSeg && !isActive ? 'opacity-40' : 'opacity-100'}`,
            style: {
                transitionProperty: 'stroke-dashoffset, stroke-width, opacity, filter',
                transitionDuration: '1000ms, 300ms, 300ms, 300ms',
                transitionDelay: `${delay}ms, 0ms, 0ms, 0ms`,
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Smooth ease
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: `rotate(${rotationOffset}deg)`,
                filter: isActive
                    ? `drop-shadow(0 0 12px ${shadowColor})`
                    : `drop-shadow(0 0 6px ${shadowColor.replace('0.8', '0.4').replace('0.6', '0.4')})`
            },
            onMouseEnter: () => setHoveredSeg(type),
            onMouseLeave: () => setHoveredSeg(null)
        };
    };

    return (
        <div className="flex flex-col items-center justify-center py-4 select-none">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="w-full h-full transform" viewBox="0 0 160 160">
                    {/* Background Track */}
                    <circle
                        cx="80" cy="80" r={radius}
                        fill="none"
                        stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'}
                        strokeWidth="12"
                    />

                    {/* Segments - Stacked for simplicity, but rotated correctly */}
                    {s > 0 && (
                        <circle {...getSegmentProps(s, sPct, '#6366f1', 'rgba(99,102,241,0.8)', -90, 0, 's')} />
                    )}
                    {c > 0 && (
                        <circle {...getSegmentProps(c, cPct, '#ec4899', 'rgba(236,72,153,0.8)', -90 + (sPct * 3.6), 200, 'c')} />
                    )}
                    {a > 0 && (
                        <circle {...getSegmentProps(a, aPct, '#10b981', 'rgba(16,185,129,0.8)', -90 + ((sPct + cPct) * 3.6), 400, 'a')} />
                    )}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    <span
                        className={`text-4xl font-black italic text-zinc-800 dark:text-white tracking-tighter transition-all duration-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                    >
                        {displayCount}
                    </span>
                    <span
                        className={`text-[10px] font-bold uppercase text-zinc-400 tracking-widest transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Sessions
                    </span>
                </div>
            </div>

            {/* Legend / Dots */}
            <div className={`flex gap-4 mt-4 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Strength Legend */}
                <div
                    className={`flex flex-col items-center transition-opacity duration-300 ${hoveredSeg && hoveredSeg !== 's' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setHoveredSeg('s')}
                    onMouseLeave={() => setHoveredSeg(null)}
                >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] mb-1"></div>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{Math.round(sPct)}%</span>
                </div>

                {/* Cardio Legend */}
                <div
                    className={`flex flex-col items-center transition-opacity duration-300 ${hoveredSeg && hoveredSeg !== 'c' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setHoveredSeg('c')}
                    onMouseLeave={() => setHoveredSeg(null)}
                >
                    <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] mb-1"></div>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{Math.round(cPct)}%</span>
                </div>

                {/* Core Legend */}
                <div
                    className={`flex flex-col items-center transition-opacity duration-300 ${hoveredSeg && hoveredSeg !== 'a' ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setHoveredSeg('a')}
                    onMouseLeave={() => setHoveredSeg(null)}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mb-1"></div>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{Math.round(aPct)}%</span>
                </div>
            </div>
        </div>
    );
};
