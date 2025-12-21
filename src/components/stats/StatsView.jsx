
import React, { useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ChevronDown, Calendar, AlertCircle, Zap, Activity } from 'lucide-react';
import { CalendarModal } from '../ui/CalendarModal';
import { StatsCard } from './StatsCard';
import { useStats } from '../../hooks/useStats';
import ErrorBoundary from '../ui/ErrorBoundary';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

/**
 * DEBUG CONTROL (Development Only)
 * Allows forcing specific user journey states for verification.
 */
const DevStatsControl = ({ forceState }) => {
    // if (process.env.NODE_ENV === 'production') return null; // Enabled for user testing

    const scenarios = [
        { label: "D0", streak: 0, workouts: 0, desc: "New User", mockDayStats: null },
        { label: "D1", streak: 1, workouts: 1, desc: "First Workout" },
        { label: "D3", streak: 3, workouts: 3, desc: "Momentum" },
        { label: "D5", streak: 5, workouts: 5, desc: "Consistency" },
        { label: "D10", streak: 10, workouts: 10, desc: "Habit" },
        { label: "D20", streak: 20, workouts: 20, desc: "Established" },
        { label: "D35", streak: 35, workouts: 35, desc: "Discipline" },
    ];

    return (
        <div className="fixed bottom-28 sm:bottom-20 right-4 z-[60] bg-black/90 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2 shadow-2xl scale-100 sm:scale-90 origin-bottom-right opacity-100 sm:opacity-30 sm:hover:opacity-100 transition-all">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Debug Journey</div>
            <div className="flex gap-1 flex-wrap max-w-[200px]">
                {scenarios.map(s => (
                    <button
                        key={s.label}
                        onClick={() => forceState(s)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-emerald-900 text-zinc-300 hover:text-emerald-400 text-[10px] rounded border border-zinc-700 transition-colors"
                        title={s.desc}
                    >
                        {s.label}
                    </button>
                ))}
                <button onClick={() => forceState(null)} className="px-2 py-1 bg-red-900/30 text-red-400 text-[10px] rounded border border-red-900/50">Reset</button>
            </div>
        </div>
    );
};

/**
 * Pure Presentation Component
 */
const StatsViewUnsafe = ({ workoutData, getPreviousBest }) => {

    // --- Hook Integration (Logic Layer) ---
    const {
        selectedDayKey,
        dayStats,
        history,
        selectDate
    } = useStats(workoutData, getPreviousBest);

    // --- Local UI State ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Debug State: object with { streak, totalWorkouts } or null
    const [forcedState, setForcedState] = useState(null);

    // --- Helpers (View Only) ---
    const getTodayStr = () => new Date().toLocaleDateString('en-CA');
    const getYesterdayStr = () => {
        const d = new Date(); d.setDate(d.getDate() - 1);
        return d.toLocaleDateString('en-CA');
    };

    const handleSelectDate = (date) => {
        const dStr = date.toLocaleDateString('en-CA');
        selectDate(dStr);
        setIsCalendarOpen(false);
        setIsDropdownOpen(false);
    };

    const getDropdownLabel = () => {
        if (selectedDayKey === getTodayStr()) return "Today";
        if (selectedDayKey === getYesterdayStr()) return "Yesterday";
        const [y, m, d] = selectedDayKey.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // --- Responsive Check ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Chart Options (Mobile Optimized) ---
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(24, 24, 27, 0.95)',
                titleColor: '#fff',
                bodyColor: '#d4d4d8',
                borderColor: '#3f3f46',
                borderWidth: 1,
                padding: 10,
                displayColors: false
            }
        },
        scales: {
            x: { grid: { color: '#27272a' }, ticks: { color: '#71717a', font: { size: 10 } } },
            y: {
                beginAtZero: true,
                grid: { color: '#27272a' },
                ticks: { color: '#71717a', font: { size: 10 } }
            }
        },
        animation: { duration: isMobile ? 800 : 1500, easing: 'easeOutQuart' }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: !isMobile, // Hide legend on mobile to save space
                position: 'right',
                labels: { color: '#a1a1aa', font: { size: 10 }, boxWidth: 10 }
            }
        },
        cutout: '70%',
        animation: { animateScale: true, animateRotate: true, duration: isMobile ? 800 : 1500 }
    };

    // --- Derived State for Logic ---
    // Use forced state if available, otherwise real history
    const activeStreak = forcedState ? forcedState.streak : history.currentStreak;
    const activeWorkouts = forcedState ? forcedState.workouts : history.totalWorkouts;
    // Use forced mockDayStats if available, otherwise real dayStats
    const activeDayStats = forcedState && forcedState.mockDayStats !== undefined ? forcedState.mockDayStats : dayStats;

    // --- AI Insight Generation (Strictly Gated) ---
    const insights = React.useMemo(() => {
        const result = { strength: null, cardio: null };

        // Day 0-1: No AI
        if (activeWorkouts < 2) return result;

        // Day 2-3 (Momentum): Neutral Observation, Confidence >= 0.55
        if (activeStreak >= 2 && activeStreak <= 3) {
            result.strength = { text: "You've logged workouts on consecutive days.", confidence: 0.6 };
        }
        // Day 7-13 (Habit Lock-In): Observational, Confidence >= 0.6
        else if (activeStreak >= 7 && activeStreak <= 13) {
            result.strength = { text: "Strength volume increased vs Day 1.", confidence: 0.65 };
        }
        // Day 30+ (Discipline): Reflective, Confidence >= 0.7
        else if (activeStreak >= 30) {
            result.strength = { text: "You maintain pace better with shorter sessions.", confidence: 0.8 };
        }

        return result;
    }, [activeStreak, activeWorkouts]);


    // --- Rendering ---
    return (
        <div className="p-4 pb-40 space-y-4 sm:space-y-6 animate-in fade-in duration-500 relative">
            <DevStatsControl forceState={setForcedState} />

            {/* Calendar Modal */}
            {isCalendarOpen && (
                <CalendarModal
                    selectedDate={new Date(selectedDayKey)}
                    onSelectDate={handleSelectDate} // Note: This expects Date object
                    onClose={() => setIsCalendarOpen(false)}
                    workoutData={workoutData}
                />
            )}

            {/* Header Section */}
            <div className="flex flex-row items-center justify-between gap-4 mb-2 sm:mb-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-500 to-pink-500 dark:from-red-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[3px_3px_0px_#000000] animate-pulse" style={{ transform: 'skew(-10deg)' }}>
                        DUO-FIT
                    </h2>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Spidey-Sense Analysis</p>
                        {/* Dormant AI Hint (Always visible, fades in) */}
                        <div className="group relative">
                            <span className="text-zinc-600 dark:text-zinc-700 text-[10px] cursor-help opacity-50 hover:opacity-100 transition-opacity">🧠</span>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Insights unlock as you train
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dropdown - Enhanced Touch Target */}
                <div className="relative z-50 self-end sm:self-auto">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 px-4 py-2.5 sm:py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors active:scale-95 touch-manipulation"
                    >
                        <Calendar size={16} className="text-emerald-500" />
                        {getDropdownLabel()}
                        <ChevronDown size={14} className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 flex flex-col z-[100]">
                            <button
                                onClick={() => handleSelectDate(new Date())}
                                className="px-5 py-4 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 touch-manipulation"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => {
                                    const d = new Date(); d.setDate(d.getDate() - 1);
                                    handleSelectDate(d);
                                }}
                                className="px-5 py-4 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 border-t border-zinc-100 dark:border-zinc-800 touch-manipulation"
                            >
                                Yesterday
                            </button>
                            <button
                                onClick={() => { setIsCalendarOpen(true); setIsDropdownOpen(false); }}
                                className="px-5 py-4 text-left text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between touch-manipulation"
                            >
                                Select Date <Calendar size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Stats Grid - 2x2 on Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StatsCard
                    title="Time"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: activeDayStats ? activeDayStats.duration.replace('m', '') : null,
                        unit: 'min',
                        label: 'Duration'
                    }}
                    trendData={history.datasets.cMin.slice(-5)}
                    dataState={!activeDayStats ? 'empty' : (activeDayStats.hasStrength || activeDayStats.hasCardio || activeDayStats.hasCore) ? 'valid' : 'partial'}
                    // Valid override for Day 0: must show empty text
                    emptyOverride={activeWorkouts === 0 ? "No data yet" : null}
                />

                <StatsCard
                    title="Volume"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: activeDayStats ? activeDayStats.strengthVol.toLocaleString() : null,
                        unit: 'kg',
                        label: 'Vol'
                    }}
                    dataState={!activeDayStats ? 'empty' : activeDayStats.hasStrength ? 'valid' : 'partial'}
                    trendData={history.datasets.sVol.slice(-5)}
                    aiInsight={insights.strength}
                />

                <StatsCard
                    title="Cardio"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: activeDayStats ? activeDayStats.cDist.toFixed(1) : null,
                        unit: 'km',
                        label: 'Dist'
                    }}
                    secondaryMetrics={activeDayStats ? [{ label: 'Time', value: `${activeDayStats.cMin}m` }] : []}
                    dataState={!activeDayStats ? 'empty' : activeDayStats.hasCardio ? 'valid' : 'partial'}
                    trendData={history.datasets.cDist.slice(-5)}
                    aiInsight={insights.cardio}
                />

                <StatsCard
                    title="Core"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: activeDayStats ? activeDayStats.aRep : null,
                        unit: 'reps',
                        label: 'Reps'
                    }}
                    dataState={!activeDayStats ? 'empty' : activeDayStats.hasCore ? 'valid' : 'partial'}
                    trendData={history.datasets.aRep.slice(-5)}
                />
            </div>

            {/* KPI Cards (Discipline, Streak) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Day Streak - Strictly per Master Prompt Ranges - Compact Mobile */}
                {(() => {
                    let config = {
                        title: "Current Streak",
                        value: activeStreak,
                        unit: "Days",
                        subtext: "Keep the fire burning!",
                        gradient: "from-yellow-300 to-yellow-600",
                        opacity: "opacity-10"
                    };

                    // DAY 0 (No Workouts)
                    if (activeWorkouts === 0) {
                        config = {
                            title: "Start your streak",
                            value: "START",
                            unit: "",
                            subtext: "Log your first workout to begin",
                            gradient: "from-zinc-400 to-zinc-600",
                            opacity: "opacity-5"
                        };
                    }
                    // DAY 1 (First Workout)
                    else if (activeWorkouts === 1) {
                        config = {
                            title: "Current Streak",
                            value: "1",
                            unit: "Day",
                            subtext: "Great start — keep going!",
                            gradient: "from-yellow-400 to-orange-500",
                            opacity: "opacity-20"
                        };
                    }
                    // DAY 2-3 (Momentum Building)
                    else if (activeStreak >= 2 && activeStreak <= 3) {
                        config = {
                            title: "Current Streak",
                            value: String(activeStreak),
                            unit: "Days",
                            subtext: "You’re building momentum 💪",
                            gradient: "from-emerald-400 to-emerald-600",
                            opacity: "opacity-20"
                        };
                    }
                    // DAY 4-6 (Consistency Phase)
                    else if (activeStreak >= 4 && activeStreak <= 6) {
                        config = {
                            title: "Current Streak",
                            value: String(activeStreak),
                            unit: "Days",
                            subtext: "Consistency looks good",
                            gradient: "from-teal-400 to-teal-600",
                            opacity: "opacity-20"
                        };
                    }
                    // DAY 7-13 (Habit Lock-In)
                    else if (activeStreak >= 7 && activeStreak <= 13) {
                        config = {
                            title: "Current Streak",
                            value: String(activeStreak),
                            unit: "Days",
                            subtext: "Keep the fire burning 🔥",
                            gradient: "from-orange-500 to-red-500",
                            opacity: "opacity-30"
                        };
                    }
                    // DAY 14-29 (Habit Established)
                    else if (activeStreak >= 14 && activeStreak <= 29) {
                        config = {
                            title: "Current Streak",
                            value: String(activeStreak),
                            unit: "Days",
                            subtext: "This is a real habit now",
                            gradient: "from-purple-500 to-pink-600",
                            opacity: "opacity-30"
                        };
                    }
                    // DAY 30+ (Discipline Phase)
                    else if (activeStreak >= 30) {
                        config = {
                            title: "Current Streak",
                            value: String(activeStreak),
                            unit: "Days",
                            subtext: "Discipline unlocked 💯",
                            gradient: "from-blue-500 to-indigo-600",
                            opacity: "opacity-40"
                        };
                    }

                    return (
                        <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-black text-white overflow-hidden shadow-xl border border-zinc-800 flex flex-row items-center justify-between sm:block">
                            <div className={`absolute top-0 right-0 p-8 ${config.opacity} transform translate-x-4 -translate-y-4 transition-opacity`}>
                                <Zap size={100} className="sm:w-[120px] sm:h-[120px]" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2">{config.title}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${config.gradient} drop-shadow-lg pr-2 pb-1`}>
                                        {config.value}
                                    </span>
                                    {config.unit && <span className="text-sm sm:text-xl font-bold text-zinc-400">{config.unit}</span>}
                                </div>
                                <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 sm:mt-2 font-medium">{config.subtext}</p>
                            </div>
                        </div>
                    );
                })()}

                {/* Discipline Score (Shown > 3 sessions) */}
                {activeWorkouts > 3 && (
                    <div className="relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2">Discipline Score</h3>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <span className="text-4xl sm:text-6xl font-black italic tracking-tighter text-zinc-800 dark:text-white">
                                {history.discipline}%
                            </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-emerald-500 font-bold mt-1 sm:mt-2 flex items-center gap-1">
                            <Activity size={12} /> Based on target completion
                        </p>
                    </div>
                )}
            </div>

            {/* Monthly Summary (Day 14+ Only) - Chip Layout */}
            {
                activeStreak >= 14 && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="mb-2">
                            <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest pl-1">Month at a Glance</h3>
                        </div>
                        <div className="flex flex-row flex-wrap gap-2 sm:grid sm:grid-cols-3">
                            <div className="bg-zinc-100 dark:bg-zinc-900/50 px-4 py-2 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center sm:flex-col sm:justify-center gap-2 sm:gap-0">
                                <span className="text-lg sm:text-3xl font-black text-zinc-800 dark:text-zinc-100">{history.monthlyStats?.sessions || 0}</span>
                                <span className="text-[9px] sm:text-xs font-bold text-zinc-500 uppercase">Sessions</span>
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-900/50 px-4 py-2 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center sm:flex-col sm:justify-center gap-2 sm:gap-0">
                                <span className="text-lg sm:text-3xl font-black text-emerald-500">{activeStreak}</span>
                                <span className="text-[9px] sm:text-xs font-bold text-zinc-500 uppercase">Streak</span>
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-900/50 px-4 py-2 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center sm:flex-col sm:justify-center gap-2 sm:gap-0 flex-grow sm:flex-grow-0">
                                <span className="text-lg sm:text-2xl font-black text-blue-500 whitespace-nowrap">{history.monthlyStats?.topFocus || "-"}</span>
                                <span className="text-[9px] sm:text-xs font-bold text-zinc-500 uppercase">Focus</span>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Charts Section - Visible only if >= 2 workouts */}
            {
                activeWorkouts >= 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pb-4">

                        {/* Training Split */}
                        <div className="p-4 sm:p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                            <h3 className="text-xs sm:text-sm font-bold text-zinc-500 uppercase mb-2 sm:mb-4">Training Split</h3>
                            <div className="h-48 sm:h-64 relative">
                                <Doughnut data={{
                                    labels: ['Strength', 'Cardio', 'Core'],
                                    datasets: [{
                                        data: history.distribution,
                                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981'],
                                        borderWidth: 0
                                    }]
                                }} options={doughnutOptions} />
                            </div>
                        </div>

                        {/* Strength Volume Trend */}
                        {history.totalVol >= 0 && (
                            <div className="p-4 sm:p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                                <h3 className="text-xs sm:text-sm font-bold text-zinc-500 uppercase mb-2 sm:mb-4">Strength Progress</h3>
                                <div className="h-48 sm:h-64">
                                    {/* Logic: If < 2 data points (approx activeWorkouts < 2, but we are inside >=2 block), show summary text instead */}
                                    {activeWorkouts < 2 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-50">
                                            <p className="text-sm font-bold text-zinc-500">Not enough data for trend line yet.</p>
                                        </div>
                                    ) : (
                                        <Line data={{
                                            labels: history.labels,
                                            datasets: [{
                                                data: history.datasets.sVol,
                                                borderColor: '#ef4444',
                                                backgroundColor: (context) => {
                                                    const ctx = context.chart.ctx;
                                                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                                                    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
                                                    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
                                                    return gradient;
                                                },
                                                fill: true,
                                                tension: 0.4
                                            }]
                                        }} options={commonOptions} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Empty State Footer CTA (Stage 0 only) */}
            {
                activeWorkouts === 0 && (
                    <div className="flex justify-center py-8">
                        <button className="px-8 py-3 rounded-full bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 animate-pulse hover:bg-emerald-400 transition-colors">
                            Start First Workout →
                        </button>
                    </div>
                )
            }

        </div >
    );
};

// --- Export with Error Boundary ---
export const StatsView = (props) => (
    <ErrorBoundary>
        <StatsViewUnsafe {...props} />
    </ErrorBoundary>
);
