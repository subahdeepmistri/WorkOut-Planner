import React, { useMemo, useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ChevronDown, Calendar, Trophy, Dumbbell, Activity, Footprints, Zap, Clock } from 'lucide-react';
import { calculateWorkoutStats } from '../../utils/helpers';
import { CalendarModal } from '../ui/CalendarModal';

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

    // --- Daily Stats Card Component (Inline) ---
    const DailyStatsCard = () => {
        if (!workoutData[selectedDayKey]) {
            return (
                <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 text-center text-zinc-600 dark:text-zinc-500 italic mb-8 shadow-lg backdrop-blur-sm">
                    No workout data for {getDropdownLabel()}.
                </div>
            );
        }

        const s = dayStats;
        const log = workoutData[selectedDayKey];

        return (
            <div className="relative mb-8 group perspective-1000">
                {/* Main Card Container */}
                <div className="relative bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-300 dark:border-zinc-700/50 rounded-3xl p-4 sm:p-6 shadow-xl dark:shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-shadow">

                    {/* Ambient Background Glows */}
                    <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${s.score >= 90 ? 'from-emerald-500/20' : 'from-blue-500/10'} to-transparent blur-[80px] rounded-full pointer-events-none opacity-60 animate-pulse`}></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-purple-500/10 to-transparent blur-[60px] rounded-full pointer-events-none opacity-40"></div>

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 tracking-wide drop-shadow-sm">
                                {log.templateName}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 box-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.15em]">
                                    SUMMARY • {new Date(selectedDayKey).toLocaleDateString(undefined, { weekday: 'long' })}
                                </p>
                            </div>
                        </div>

                        {/* Adherence Badge */}
                        <div className={`
                            relative px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border flex items-center gap-2 shadow-lg backdrop-blur-md transition-transform hover:scale-105
                            ${s.score >= 90
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-300'
                            }
                        `}>
                            <Trophy size={14} className={s.score >= 90 ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"} />
                            <span className="text-xs font-black font-mono tracking-wider">{s.score}% ADHERENCE</span>
                        </div>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 relative z-10">

                        {/* 1. Time */}
                        {/* 1. Time */}
                        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-xl p-2 sm:p-3 border border-zinc-300 dark:border-zinc-700/30 flex flex-col items-center justify-center gap-1 group/card hover:scale-[1.03] transition-all hover:border-zinc-400/50 dark:hover:border-zinc-500/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-0 group-hover/card:opacity-50 transition-opacity"></div>
                            <div className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 group-hover/card:bg-zinc-200 dark:group-hover/card:bg-zinc-700 group-hover/card:text-zinc-900 dark:group-hover/card:text-white transition-colors shadow-inner">
                                <Clock size={14} strokeWidth={2.5} />
                            </div>
                            <div className="text-center">
                                <span className="text-lg sm:text-2xl font-black italic text-zinc-900 dark:text-white block drop-shadow-md leading-none mb-1">{s.duration}</span>
                                <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest group-hover/card:text-zinc-600 dark:group-hover/card:text-zinc-400 transition-colors">Time</span>
                            </div>
                        </div>

                        {/* 2. Volume (Power) */}
                        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-xl p-2 sm:p-3 border border-zinc-300 dark:border-zinc-700/30 flex flex-col items-center justify-center gap-1 group/card hover:scale-[1.03] transition-all hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
                            {s.strengthVol > 0 && <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-hover/card:opacity-100 opacity-0 transition-opacity"></div>}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover/card:opacity-50 transition-opacity"></div>

                            <div className={`p-1.5 rounded-full shadow-inner transition-colors ${s.strengthVol > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover/card:bg-emerald-500 group-hover/card:text-white' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-600'}`}>
                                <Zap size={14} strokeWidth={2.5} className={s.strengthVol > 0 ? 'fill-emerald-400/20' : ''} />
                            </div>
                            <div className="text-center relative z-10">
                                <span className={`text-lg sm:text-2xl font-black italic block drop-shadow-md leading-none mb-1 ${s.strengthVol > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-600'}`}>
                                    {(s.strengthVol / 1000).toFixed(1)}k
                                </span>
                                <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest group-hover/card:text-zinc-600 dark:group-hover/card:text-zinc-400 transition-colors">Vol (kg)</span>
                            </div>
                        </div>

                        {/* 3. Cardio */}
                        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-xl p-2 sm:p-3 border border-zinc-300 dark:border-zinc-700/30 flex flex-col items-center justify-center gap-1 group/card hover:scale-[1.03] transition-all hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] relative overflow-hidden">
                            {s.cardioVol > 0 && <div className="absolute inset-0 bg-pink-500/5 blur-xl group-hover/card:opacity-100 opacity-0 transition-opacity"></div>}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover/card:opacity-50 transition-opacity"></div>

                            <div className={`p-1.5 rounded-full shadow-inner transition-colors ${s.cardioVol > 0 ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 group-hover/card:bg-pink-500 group-hover/card:text-white' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-600'}`}>
                                <Footprints size={14} strokeWidth={2.5} />
                            </div>
                            <div className="text-center relative z-10">
                                <span className={`text-lg sm:text-2xl font-black italic block drop-shadow-md leading-none mb-1 ${s.cardioVol > 0 ? 'text-pink-600 dark:text-pink-400' : 'text-zinc-600 dark:text-zinc-600'}`}>
                                    {s.cardioVol}
                                </span>
                                <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest group-hover/card:text-zinc-600 dark:group-hover/card:text-zinc-400 transition-colors">Cardio</span>
                            </div>
                        </div>

                        {/* 4. Core */}
                        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-xl p-2 sm:p-3 border border-zinc-300 dark:border-zinc-700/30 flex flex-col items-center justify-center gap-1 group/card hover:scale-[1.03] transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden">
                            {s.absVol > 0 && <div className="absolute inset-0 bg-cyan-500/5 blur-xl group-hover/card:opacity-100 opacity-0 transition-opacity"></div>}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/card:opacity-50 transition-opacity"></div>

                            <div className={`p-1.5 rounded-full shadow-inner transition-colors ${s.absVol > 0 ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 group-hover/card:bg-cyan-500 group-hover/card:text-white' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-600'}`}>
                                <Activity size={14} strokeWidth={2.5} />
                            </div>
                            <div className="text-center relative z-10">
                                <span className={`text-lg sm:text-2xl font-black italic block drop-shadow-md leading-none mb-1 ${s.absVol > 0 ? 'text-cyan-700 dark:text-cyan-400' : 'text-zinc-600 dark:text-zinc-600'}`}>
                                    {s.absVol}
                                </span>
                                <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest group-hover/card:text-zinc-600 dark:group-hover/card:text-zinc-400 transition-colors">Core</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
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
            let sv = 0, cm = 0, cd = 0, ar = 0, has = false;
            day.exercises.forEach(ex => {
                let exIsActive = false;

                // Discipline: Target Calculation
                const tReps = ex.numericalTargetReps || 8;
                const tSets = ex.targetSets || 3;
                globalTargetVol += (tSets * tReps);

                ex.sets.forEach(s => {
                    globalSets++;
                    if (s.completed) {
                        globalCompleted++;
                        has = true; exIsActive = true;

                        // Discipline: Actual Calculation
                        let repVal = 0;
                        if (ex.type === 'cardio') repVal = tReps; // simplified assumption for cardio: 100% adherence if done
                        else if (ex.type === 'abs') repVal = (parseFloat(s.reps) || parseFloat(s.holdTime) || 0);
                        else repVal = (parseFloat(s.reps) || 0);

                        globalActualVol += repVal;

                        if (ex.type === 'abs') { ar += (s.reps || 0) + (parseFloat(s.holdTime) || 0); }
                        else if (ex.type === 'cardio') {
                            cm += (parseFloat(s.time) || 0);
                            cd += (parseFloat(s.distance) || 0);
                        }
                        else {
                            const vol = (s.weight || 0) * (s.reps || 0);
                            sv += vol;
                            totalVol += vol;
                        }
                    }
                });
                if (exIsActive) {
                    if (ex.type === 'abs') aCount++;
                    else if (ex.type === 'cardio') cCount++;
                    else sCount++;
                }
            });
            if (has) {
                lbs.push(new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
                sVol.push(sv);
                cMin.push(cm);
                cDist.push(cd);
                aRep.push(ar);
            }
        });

        // Calculate Streak
        let currentStreak = 0;
        if (dates.length > 0) {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            // Check if last workout was today or yesterday
            const lastDate = dates[dates.length - 1];
            if (lastDate === todayStr || lastDate === yesterdayStr) {
                currentStreak = 1;
                for (let i = dates.length - 2; i >= 0; i--) {
                    const curr = new Date(dates[i]);
                    const prev = new Date(dates[i + 1]);
                    const diffTime = Math.abs(prev - curr);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) currentStreak++;
                    else break;
                }
            }
        }

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

            {/* Daily Summary Card */}
            <DailyStatsCard />

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
                    <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm relative overflow-hidden group">
                        <span className={`text-2xl font-black italic drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] ${stats.discipline >= 90 ? 'text-green-500' : stats.discipline >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {stats.discipline}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-500 tracking-wider mt-1">Discipline</span>
                        {stats.discipline < 100 && (
                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500/50 animate-pulse" title="Missed Gains detected"></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Layout (Charts) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Training Distribution */}
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

                {/* 2. Strength Volume */}
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

                {/* 3. Cardio Output */}
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

                {/* 4. Core Intensity */}
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
            </div>
        </div>
    );
};
