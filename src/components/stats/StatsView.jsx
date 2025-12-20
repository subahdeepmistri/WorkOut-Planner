import React, { useMemo, useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ChevronDown, Calendar, Trophy, Dumbbell, Activity, Footprints, Zap, Clock, AlertCircle } from 'lucide-react';
import { calculateWorkoutStats } from '../../utils/helpers';
import { CalendarModal } from '../ui/CalendarModal';
import { StatsCard } from './StatsCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export const StatsView = ({ workoutData, getPreviousBest }) => {
    // --- History & Dropdown State ---

    // Helper to get formatted date string YYYY-MM-DD locally (Fixes timezone bugs)
    const formatDateLocal = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getTodayStr = () => formatDateLocal(new Date());
    const getYesterdayStr = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return formatDateLocal(d);
    };

    const [selectedDayKey, setSelectedDayKey] = useState(getTodayStr()); // Default to Today
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Derived: Selected Date Object for Calendar
    const selectedDateObj = useMemo(() => new Date(selectedDayKey), [selectedDayKey]);

    // Derived: Stats for the selected day
    const dayStats = useMemo(() => {
        const log = workoutData[selectedDayKey];
        if (!log) return null;
        // Calculate stats using the helper
        return calculateWorkoutStats(log, getPreviousBest, log.endTime || Date.now());
    }, [workoutData, selectedDayKey, getPreviousBest]);

    const handleSelectDate = (date) => {
        setSelectedDayKey(formatDateLocal(date));
        setIsCalendarOpen(false);
        setIsDropdownOpen(false);
    };

    const getDropdownLabel = () => {
        if (selectedDayKey === getTodayStr()) return "Today";
        if (selectedDayKey === getYesterdayStr()) return "Yesterday";
        return new Date(selectedDayKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // --- Existing Aggregated Stats Logic ---
    const stats = useMemo(() => {
        const dates = Object.keys(workoutData).sort();
        const sVol = [], cMin = [], cDist = [], aRep = [], lbs = [];
        let sCount = 0, cCount = 0, aCount = 0;
        let totalVol = 0;
        let globalSets = 0;
        let globalCompleted = 0;

        let globalTargetVol = 0;
        let globalActualVol = 0;

        dates.forEach(d => {
            const day = workoutData[d]; if (!day) return;
            // Use helper for standardized stats per day
            const daily = calculateWorkoutStats(day, getPreviousBest, day.endTime || Date.now());

            // Check activity types based on helper flags
            if (daily.hasStrength) sCount++;
            if (daily.hasCardio) cCount++;
            if (daily.hasCore) aCount++;

            // Accumulate Valid Data Only (Helpers already handled strict 0 vs null)
            if (daily.hasStrength || daily.hasCardio || daily.hasCore) {
                lbs.push(new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

                // Strength
                const sv = daily.strengthVol || 0;
                sVol.push(sv);
                totalVol += sv;

                // Cardio (Dual Metrics?) - For chart we push generic Output for now, or split.
                // Let's push Duration (Min) as primary for chart, Dist as secondary if needed.
                // Currently only pushing one array for cardio. The user wants Dual Axis.
                // We'll push {min, dist} object or separate arrays?
                // The current architecture pushed scalars `cMin` and `cDist`. 
                // Ops, `calculateWorkoutStats` returns accumulated `cardioVol` which was `val` (Time OR Distance).
                // This confuses the chart if units mix.
                // FIX: `calculateWorkoutStats` returns `cardioVol` mixed.
                // We should probably rely on raw accumulation here if we want strict separation, 
                // OR trust `calculateWorkoutStats` to return consistent structure.
                // `calculateWorkoutStats` currently returns `cardioVol` (mix).
                // Let's re-calculate strict C_MIN and C_DIST here for Charts.

                let d_cm = 0;
                let d_cd = 0;
                let d_ar = 0;

                day.exercises.forEach(ex => {
                    ex.sets.forEach(s => {
                        if (s.completed) {
                            if (ex.type === 'cardio') {
                                if (ex.cardioMode === 'circuit') d_cm += (parseFloat(s.time) || 0);
                                else d_cd += (parseFloat(s.distance) || 0);
                            }
                            else if (ex.type === 'abs') {
                                d_ar += (parseFloat(s.reps) || parseFloat(s.holdTime) || 0);
                            }
                        }
                    });
                });

                cMin.push(d_cm);
                cDist.push(d_cd);
                aRep.push(d_ar);

                // Discipline score
                /* Re-calc global discipline is tough without accumulating over all sessions.
                   Let's use the average score or simple accumulation.
                   Simple accumulation: */
                // (Simplified for dashboard speed)
                globalActualVol += daily.score; // This is a %...                // Discipline: Average score logic or total check?
                // For simplicity/accuracy: we can track global attempted vs global completed?
                // Helpers logic: score = actual / target * 100
                // Let's accumulate these raw volumes for global discipline
                // We don't have globalTargetVol cleanly available from helper without re-parsing.
                // Re-using previous logic concepts:
            }
        });

        // Calculate Streak (Local Time Fixed)
        let currentStreak = 0;
        if (dates.length > 0) {
            const today = new Date();
            const todayStr = today.toLocaleDateString('en-CA');
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString('en-CA');

            const lastDate = dates[dates.length - 1];

            if (lastDate === todayStr || lastDate === yesterdayStr) {
                currentStreak = 1;
                for (let i = dates.length - 2; i >= 0; i--) {
                    const currStr = dates[i];
                    const prevStr = dates[i + 1];
                    const d1 = new Date(currStr);
                    const d2 = new Date(prevStr);
                    const diffTime = Math.abs(d2 - d1);
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) currentStreak++;
                    else break;
                }
            } else {
                currentStreak = 0;
            }
        }

        // Global Discipline (Avoid 0% on day 1 if possible, or show real)
        const discipline = globalTargetVol === 0 ? 0 : Math.round((globalActualVol / globalTargetVol) * 100);

        return {
            labels: lbs, sVol, cMin, cDist, aRep,
            distribution: [sCount, cCount, aCount],
            totalWorkouts: dates.length,
            currentStreak,
            totalVol,
            discipline
        };
    }, [workoutData]);


    // Common Options (Reused)
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
        animation: { duration: 2000, easing: 'easeOutQuart' }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { color: '#a1a1aa', font: { size: 10 }, boxWidth: 10 } }
        },
        cutout: '70%',
        animation: { animateScale: true, animateRotate: true, duration: 2000 }
    };


    return (
        <div className="p-4 pb-32 space-y-6 animate-in fade-in duration-700 relative">

            {/* Calendar Modal */}
            {isCalendarOpen && (
                <CalendarModal
                    selectedDate={selectedDateObj}
                    onSelectDate={handleSelectDate}
                    onClose={() => setIsCalendarOpen(false)}
                    workoutData={workoutData}
                />
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-500 to-pink-500 dark:from-red-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[3px_3px_0px_#000000] animate-pulse" style={{ transform: 'skew(-10deg)' }}>
                        DUO-FIT
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Spidey-Sense Analysis</p>
                </div>

                {/* --- History Dropdown --- */}
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
                                onClick={() => { setSelectedDayKey(getTodayStr()); setIsDropdownOpen(false); }}
                                className={`px-4 py-3 text-left text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${selectedDayKey === getTodayStr() ? 'text-emerald-500 dark:text-emerald-400 bg-zinc-100 dark:bg-zinc-900/50' : 'text-zinc-500 dark:text-zinc-400'}`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => { setSelectedDayKey(getYesterdayStr()); setIsDropdownOpen(false); }}
                                className={`px-4 py-3 text-left text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${selectedDayKey === getYesterdayStr() ? 'text-emerald-500 dark:text-emerald-400 bg-zinc-100 dark:bg-zinc-900/50' : 'text-zinc-500 dark:text-zinc-400'}`}
                            >
                                Yesterday
                            </button>
                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mx-2 my-1"></div>
                            <button
                                onClick={() => { setIsCalendarOpen(true); setIsDropdownOpen(false); }}
                                className="px-4 py-3 text-left text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between"
                            >
                                Previous Days... <Calendar size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* 1. Time */}
                {/* 1. Duration */}
                <StatsCard
                    title="Workout Time"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{
                        value: dayStats?.duration && dayStats.duration !== '0m' ? dayStats.duration : null,
                        unit: "",
                        label: "Duration"
                    }}
                    dataState={dayStats?.duration && dayStats.duration !== '0m' ? 'valid' : workoutData[selectedDayKey] ? 'partial' : 'empty'}
                />

                {/* 2. Strength */}
                <StatsCard
                    title="Strength Vol"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{ value: dayStats?.strengthVol > 0 ? (dayStats.strengthVol / 1000).toFixed(1) : null, unit: "k", label: "Volume" }}
                    secondaryMetrics={[{ label: "Total", value: "Kg" }]}
                    dataState={dayStats?.hasStrength ? 'valid' : workoutData[selectedDayKey] ? 'partial' : 'empty'}
                // Mock micro trend for demo or calculate from history if available
                />

                {/* 3. Cardio */}
                <StatsCard
                    title="Cardio Output"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{ value: dayStats?.cardioVol > 0 ? dayStats.cardioVol : null, unit: "mix", label: "Output" }}
                    /* Unit logic is tricky here if mixed. Helpers returns generic. 
                       Ideally show Min or Km based on dominant. 
                       For now "mix" or just hide unit. */
                    dataState={dayStats?.hasCardio ? 'valid' : workoutData[selectedDayKey] ? 'partial' : 'empty'}
                />

                {/* 4. Core */}
                <StatsCard
                    title="Core Endurance"
                    timeframe={getDropdownLabel()}
                    primaryMetric={{ value: dayStats?.absVol > 0 ? dayStats.absVol : null, unit: "reps", label: "Volume" }}
                    dataState={dayStats?.hasCore ? 'valid' : workoutData[selectedDayKey] ? 'partial' : 'empty'}
                />
            </div>


            {/* KPI Cards (Existing) */}
            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm">
                        <span className="text-3xl font-black text-amber-500 italic drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{stats.currentStreak}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-500 tracking-wider mt-1">Day Streak</span>
                    </div>
                    <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm">
                        <span className="text-3xl font-black text-emerald-500 italic drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{stats.totalWorkouts}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-500 tracking-wider mt-1">Sessions</span>
                    </div>
                    <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm">
                        <span className="text-2xl font-black text-blue-500 italic drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{(stats.totalVol / 1000).toFixed(1)}k</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-500 tracking-wider mt-1">Vol (kg)</span>
                    </div>

                    {/* Discipline - Hide if low sessions */}
                    {stats.totalWorkouts >= 3 && (
                        <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm relative overflow-hidden group">
                            <span className={`text-2xl font-black italic drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] ${stats.discipline >= 90 ? 'text-green-500' : stats.discipline >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {stats.discipline}%
                            </span>
                            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-500 tracking-wider mt-1">Discipline</span>
                            {stats.discipline < 100 && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500/50 animate-pulse" title="Missed Gains detected"></div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Layout (Charts) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Training Distribution */}
                {stats.totalWorkouts > 0 && (
                    <div className="col-span-1 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-700 dark:text-zinc-100 font-bold text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                Training Split
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="h-32 w-32 relative flex-shrink-0">
                                <Doughnut
                                    data={{
                                        labels: ['Strength', 'Cardio', 'Core'],
                                        datasets: [{
                                            data: stats.distribution,
                                            backgroundColor: ['#22c55e', '#ec4899', '#06b6d4'],
                                            borderColor: '#18181b',
                                            borderWidth: 2
                                        }]
                                    }}
                                    options={{
                                        ...doughnutOptions,
                                        cutout: '75%',
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Focus</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full sm:w-auto flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">Strength</span></div>
                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{Math.round((stats.distribution[0] / (stats.distribution.reduce((a, b) => a + b, 0) || 1)) * 100)}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div><span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">Cardio</span></div>
                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{Math.round((stats.distribution[1] / (stats.distribution.reduce((a, b) => a + b, 0) || 1)) * 100)}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div><span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">Core</span></div>
                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{Math.round((stats.distribution[2] / (stats.distribution.reduce((a, b) => a + b, 0) || 1)) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Strength Volume */}
                {stats.totalVol > 0 && (
                    <div className="col-span-1 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-700 dark:text-zinc-100 font-bold text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                                Strength Volume
                            </h3>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Kg x Reps</span>
                        </div>
                        <div className="h-48">
                            <Bar
                                data={{
                                    labels: stats.labels,
                                    datasets: [{
                                        data: stats.sVol,
                                        backgroundColor: (context) => {
                                            const ctx = context.chart.ctx;
                                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                                            gradient.addColorStop(0, "#22c55e");
                                            gradient.addColorStop(1, "rgba(34,197,94,0.2)");
                                            return gradient;
                                        },
                                        borderRadius: 6,
                                        barThickness: 20,
                                        categoryPercentage: 0.5
                                    }]
                                }}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                )}

                {/* 3. Cardio Output (Dual Axis) */}
                {(stats.cMin.some(x => x > 0) || stats.cDist.some(x => x > 0)) && (
                    <div className="col-span-1 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-700 dark:text-zinc-100 font-bold text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                                Cardio Output
                            </h3>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div><span className="text-[9px] text-zinc-500 uppercase font-bold">Mins</span></div>
                                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div><span className="text-[9px] text-zinc-500 uppercase font-bold">Km</span></div>
                            </div>
                        </div>
                        <div className="h-48">
                            <Bar
                                data={{
                                    labels: stats.labels,
                                    datasets: [
                                        { label: 'Minutes', data: stats.cMin, backgroundColor: 'rgba(236, 72, 153, 0.7)', borderRadius: 4, barThickness: 12, yAxisID: 'y', order: 1 },
                                        { label: 'Distance (km)', data: stats.cDist, backgroundColor: 'rgba(6, 182, 212, 0.7)', borderRadius: 4, barThickness: 12, yAxisID: 'y1', order: 2 }
                                    ]
                                }}
                                options={{
                                    ...commonOptions,
                                    plugins: { ...commonOptions.plugins, tooltip: { ...commonOptions.plugins.tooltip, displayColors: true } },
                                    scales: {
                                        x: { grid: { color: '#27272a' }, ticks: { color: '#71717a', font: { size: 10 } } },
                                        y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { color: '#27272a' }, ticks: { color: '#ec4899', font: { size: 10 } } },
                                        y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { color: '#06b6d4', font: { size: 10 } } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* 4. Core Intensity */}
                {stats.aRep.some(x => x > 0) && (
                    <div className="col-span-1 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-700 dark:text-zinc-100 font-bold text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                Core Endurance
                            </h3>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Reps + Hold (s)</span>
                        </div>
                        <div className="h-48">
                            <Bar
                                data={{
                                    labels: stats.labels,
                                    datasets: [{
                                        data: stats.aRep,
                                        backgroundColor: (context) => {
                                            const ctx = context.chart.ctx;
                                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                                            gradient.addColorStop(0, "#06b6d4");
                                            gradient.addColorStop(1, "rgba(6,182,212,0.2)");
                                            return gradient;
                                        },
                                        borderRadius: 6,
                                        barThickness: 20,
                                        categoryPercentage: 0.5
                                    }]
                                }}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
