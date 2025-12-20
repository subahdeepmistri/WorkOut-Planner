
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

    // --- Chart Options ---
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
        animation: { duration: 1500, easing: 'easeOutQuart' }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { color: '#a1a1aa', font: { size: 10 }, boxWidth: 10 } }
        },
        cutout: '70%',
        animation: { animateScale: true, animateRotate: true, duration: 1500 }
    };

    // --- Rendering ---
    return (
        <div className="p-4 pb-40 space-y-6 animate-in fade-in duration-700 relative">

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
            <div className="flex flex-row items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-500 to-pink-500 dark:from-red-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[3px_3px_0px_#000000] animate-pulse" style={{ transform: 'skew(-10deg)' }}>
                        DUO-FIT
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Spidey-Sense Analysis</p>
                </div>

                {/* Dropdown */}
                <div className="relative z-50 self-end sm:self-auto">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <Calendar size={14} className="text-emerald-500" />
                        {getDropdownLabel()}
                        <ChevronDown size={14} className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 flex flex-col">
                            <button
                                onClick={() => handleSelectDate(new Date())}
                                className="px-4 py-3 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => {
                                    const d = new Date(); d.setDate(d.getDate() - 1);
                                    handleSelectDate(d);
                                }}
                                className="px-4 py-3 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 border-t border-zinc-100 dark:border-zinc-800"
                            >
                                Yesterday
                            </button>
                            <button
                                onClick={() => { setIsCalendarOpen(true); setIsDropdownOpen(false); }}
                                className="px-4 py-3 text-left text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
                            >
                                Select Date <Calendar size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StatsCard
                    title="Workout Time"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: dayStats ? dayStats.duration.replace('m', '') : null,
                        unit: 'min',
                        label: 'Duration'
                    }}
                    trendData={history.datasets.cMin.slice(-5)}
                    dataState={!dayStats ? 'empty' : (dayStats.hasStrength || dayStats.hasCardio || dayStats.hasCore) ? 'valid' : 'partial'}
                    aiInsight={{ text: "Consistent effort builds habits.", confidence: 0.6 }}
                />

                <StatsCard
                    title="Strength Vol"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: dayStats ? dayStats.strengthVol.toLocaleString() : null,
                        unit: 'kg',
                        label: 'Volume'
                    }}
                    dataState={!dayStats ? 'empty' : dayStats.hasStrength ? 'valid' : 'partial'}
                    trendData={history.datasets.sVol.slice(-5)}
                />

                <StatsCard
                    title="Cardio Output"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: dayStats ? dayStats.cDist.toFixed(1) : null,
                        unit: 'km',
                        label: 'Distance'
                    }}
                    secondaryMetrics={dayStats ? [{ label: 'Time', value: `${dayStats.cMin}m` }] : []}
                    dataState={!dayStats ? 'empty' : dayStats.hasCardio ? 'valid' : 'partial'}
                    trendData={history.datasets.cDist.slice(-5)}
                />

                <StatsCard
                    title="Core Endurance"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: dayStats ? dayStats.aRep : null,
                        unit: 'reps',
                        label: 'Reps'
                    }}
                    dataState={!dayStats ? 'empty' : dayStats.hasCore ? 'valid' : 'partial'}
                    trendData={history.datasets.aRep.slice(-5)}
                />
            </div>

            {/* KPI Cards (Discipline, Streak) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Day Streak */}
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-black text-white overflow-hidden shadow-xl border border-zinc-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                        <Zap size={120} />
                    </div>

                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Streak</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg">
                            {history.currentStreak}
                        </span>
                        <span className="text-xl font-bold text-zinc-400">Days</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 font-medium">Keep the fire burning!</p>
                </div>

                {/* Discipline Score (Shown > 3 sessions) */}
                {history.totalWorkouts > 3 && (
                    <div className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                        <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Discipline Score</h3>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <span className="text-6xl font-black italic tracking-tighter text-zinc-800 dark:text-white">
                                {history.discipline}%
                            </span>
                        </div>
                        <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                            <Activity size={12} /> Based on target completion
                        </p>
                    </div>
                )}
            </div>

            {/* Charts Section - Conditionally Rendered */}
            {history.totalWorkouts > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">

                    {/* Training Split */}
                    <div className="p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4">Training Split</h3>
                        <div className="h-64 relative">
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
                    {history.totalVol > 0 && (
                        <div className="p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4">Strength Progress (Trend)</h3>
                            <div className="h-64">
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
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State Footer */}
            {history.totalWorkouts === 0 && (
                <div className="text-center py-12 opacity-50">
                    <AlertCircle className="mx-auto mb-2 text-zinc-400" size={32} />
                    <p className="text-zinc-500">No workout history found. Start your journey!</p>
                </div>
            )}

        </div>
    );
};

// --- Export with Error Boundary ---
export const StatsView = (props) => (
    <ErrorBoundary>
        <StatsViewUnsafe {...props} />
    </ErrorBoundary>
);
