import React, { useState, useMemo } from 'react';
import { Sparkles, Brain, Info, TrendingUp, AlertCircle, X } from 'lucide-react';

/**
 * StatsCard Component
 * A premium, data-integrity focused card for displaying health metrics.
 * 
 * @param {Object} props
 * @param {string} props.title - Card header title (e.g., "Cardio Output")
 * @param {string} props.timeframe - Context text (e.g., "Today • 1 session")
 * @param {Object} props.primaryMetric - The main hero value
 * @param {number|null} props.primaryMetric.value - The raw number (null if no data)
 * @param {string} props.primaryMetric.unit - The unit (e.g., "min", "kg")
 * @param {string} props.primaryMetric.label - Accessibility label
 * @param {Array<{label: string, value: string}>} [props.secondaryMetrics] - Optional secondary stats
 * @param {number[]} [props.trendData] - Array of normalized values (0-1) for micro-chart (max 5)
 * @param {"empty" | "partial" | "valid"} props.dataState - Data integrity state
 * @param {Object} [props.aiInsight] - Optional AI suggestion
 * @param {string} props.aiInsight.text - Insight text
 * @param {number} props.aiInsight.confidence - AI Confidence score (0.0 - 1.0)
 */
export const StatsCard = ({
    title,
    timeframe,
    primaryMetric,
    secondaryMetrics = [],
    trendData = [],
    dataState = "empty", // Default to safest state
    aiInsight
}) => {
    const [isInsightDismissed, setIsInsightDismissed] = useState(false);

    // --- 1. AI Visibility Logic ---
    const showAi = useMemo(() => {
        if (dataState !== 'valid') return false; // AI needs valid data
        if (!aiInsight) return false;
        if (isInsightDismissed) return false;
        if (aiInsight.confidence < 0.55) return false; // Confidence Gate
        return true;
    }, [dataState, aiInsight, isInsightDismissed]);

    const isHighConfidence = aiInsight?.confidence >= 0.7;

    // --- 2. Data State Handling ---

    // EMPTY STATE (No data at all)
    if (dataState === 'empty') {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-white/5 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm min-h-[180px] animate-in fade-in zoom-in-95 duration-500">
                <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800/50 mb-3 group-hover:scale-110 transition-transform">
                    <AlertCircle size={20} className="text-zinc-400 dark:text-zinc-600" />
                </div>
                <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1">{title}</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-[200px]">
                    No data yet. Complete a workout to unlock stats.
                </p>
            </div>
        );
    }

    // PARTIAL STATE (Workout exists, but specific metric missing)
    if (dataState === 'partial') {
        return (
            <div className="relative rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-5 backdrop-blur-md opacity-75">
                <Header title={title} timeframe={timeframe} />
                <div className="mt-6 flex flex-col gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-zinc-300 dark:text-zinc-700 tracking-tighter">
                        —
                    </span>
                    <p className="text-xs font-medium text-zinc-400 dark:text-zinc-600 flex items-center gap-1.5">
                        <Info size={12} />
                        No {primaryMetric.unit || 'data'} recorded today
                    </p>
                </div>
            </div>
        );
    }

    // VALID STATE (Full Render)
    return (
        <div className="group relative rounded-3xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-700">

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-transparent rounded-full blur-[40px] pointer-events-none -z-10 group-hover:opacity-100 transition-opacity opacity-50"></div>

            {/* Header */}
            <Header title={title} timeframe={timeframe} showAiIcon={showAi} />

            <div className="mt-4 sm:mt-6 relative z-10">
                <div className="flex items-end justify-between gap-4">
                    {/* Primary Metric */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl sm:text-5xl font-black italic text-zinc-800 dark:text-zinc-100 tracking-tighter drop-shadow-sm">
                                {primaryMetric.value !== null ? primaryMetric.value : "—"}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                {primaryMetric.unit}
                            </span>
                        </div>
                        {/* Secondary Metrics */}
                        {secondaryMetrics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {secondaryMetrics.map((sm, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">{sm.label}:</span>
                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-mono">{sm.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Micro Trend Chart */}
                    {trendData && trendData.length >= 2 && (
                        <div className="flex flex-col items-end gap-1 mb-1">
                            <MicroTrend data={trendData} />
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insight Section */}
            {showAi && (
                <div className={`mt-3 sm:mt-5 relative overflow-hidden rounded-xl border p-2 sm:p-3.5 transition-all animate-in slide-in-from-bottom-2 duration-500 ${isHighConfidence
                    ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/20"
                    : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20"
                    }`}>
                    {/* Background Sparkle for High Confidence */}
                    {isHighConfidence && (
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-400/20 blur-xl rounded-full pointer-events-none"></div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 relative z-10 w-full">
                        <div className={`mt-0.5 p-1 sm:p-1.5 rounded-lg flex-shrink-0 inline-flex ${isHighConfidence ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            }`}>
                            {isHighConfidence ? <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" /> : <Brain size={12} className="sm:w-3.5 sm:h-3.5" />}
                        </div>

                        <div className="flex-1 w-full sm:w-auto">
                            <p className="text-[10px] sm:text-xs font-semibold text-zinc-700 dark:text-zinc-200 leading-tight sm:leading-relaxed break-words">
                                {aiInsight.text}
                            </p>
                            {isHighConfidence && (
                                <p className="text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5 sm:mt-1 opacity-80">
                                    Trusted Insight
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => setIsInsightDismissed(true)}
                            className="absolute top-1 right-1 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                            aria-label="Dismiss insight"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Components ---

const Header = ({ title, timeframe, showAiIcon }) => (
    <div className="flex items-start justify-between">
        <div className="flex flex-col">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-0.5">
                {title}
            </h3>
            <span className="text-[10px] font-bold text-zinc-400/80 dark:text-zinc-600">
                {timeframe}
            </span>
        </div>
        {showAiIcon && (
            <div className="animate-pulse">
                <Brain size={16} className="text-emerald-500 dark:text-emerald-400 opacity-60" />
            </div>
        )}
    </div>
);

/**
 * MicroTrend
 * Minimalist SVG sparkline for visual consistency.
 * No axes, pure trend.
 */
const MicroTrend = ({ data }) => {
    // Normalize data for SVG (0-100 range)
    // Assuming 'data' prop is already somewhat normalized, but we ensure it fits the box.
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // SVG Dimensions
    const width = 60;
    const height = 24;

    // Generate Polyline points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const normalizedY = (val - min) / range;
        const y = height - (normalizedY * height); // Invert Y for SVG coords
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="flex flex-col items-end gap-1 opacity-80">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <polyline
                    points={points}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-500 dark:text-emerald-400"
                />
            </svg>
            <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp size={10} /> Trend
            </span>
        </div>
    );
};
