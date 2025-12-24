
import React, { useState } from 'react';
import { ChevronDown, Calendar, Zap, Activity, TrendingUp, Award, Layers, Clock } from 'lucide-react';
import { CalendarModal } from '../ui/CalendarModal';
import { RadialSplit } from './RadialSplit';
import { SplitEnergyBars } from './SplitEnergyBars';
import { HeroStatsCard } from './HeroStatsCard';
import { DualMetricCard } from './DualMetricCard';
import { AnalyticsTrends } from './AnalyticsTrends';
import { useStats } from '../../hooks/useStats';
import ErrorBoundary from '../ui/ErrorBoundary';

/**
 * Section Header Component - Visual Hierarchy
 */
const SectionHeader = ({ title, subtitle, icon: Icon, type = 'secondary', color = "text-zinc-500" }) => (
    <div className={`flex items-center gap-3 mb-6 mt-10 pb-3 border-b ${type === 'primary'
        ? 'border-zinc-200 dark:border-zinc-700'
        : 'border-zinc-100 dark:border-zinc-800/60'
        }`}>
        <div className={`p-1.5 rounded-lg ${type === 'primary' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-transparent'}`}>
            {Icon && <Icon size={type === 'primary' ? 18 : 16} className={color} />}
        </div>
        <div>
            <h3 className={`font-bold uppercase tracking-widest ${type === 'primary'
                ? 'text-sm text-zinc-800 dark:text-zinc-200'
                : 'text-xs text-zinc-400 dark:text-zinc-500'
                }`}>
                {title}
            </h3>
            <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600">
                {subtitle}
            </p>
        </div>
    </div>
);

/**
 * Pure Presentation Component
 */
const StatsViewUnsafe = ({ workoutData, getPreviousBest, theme }) => {

    // --- Hook Integration ---
    const {
        selectedDayKey,
        dayStats,
        history,
        selectDate
    } = useStats(workoutData, getPreviousBest);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Helpers
    const getTodayStr = () => new Date().toLocaleDateString('en-CA');
    const getYesterdayStr = () => {
        const d = new Date(); d.setDate(d.getDate() - 1);
        return d.toLocaleDateString('en-CA');
    };

    const handleSelectDate = (date) => {
        selectDate(date.toLocaleDateString('en-CA'));
        setIsCalendarOpen(false);
        setIsDropdownOpen(false);
    };

    const getDropdownLabel = () => {
        if (selectedDayKey === getTodayStr()) return "Today";
        if (selectedDayKey === getYesterdayStr()) return "Yesterday";
        const [y, m, d] = selectedDayKey.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const activeStreak = history.currentStreak;
    const activeWorkouts = history.totalWorkouts;
    const activeDayStats = dayStats;

    return (
        <div className="p-4 pb-40 space-y-2 animate-in fade-in duration-500 relative">

            {/* Calendar Modal */}
            {isCalendarOpen && (
                <CalendarModal
                    selectedDate={new Date(selectedDayKey)}
                    onSelectDate={handleSelectDate}
                    onClose={() => setIsCalendarOpen(false)}
                    workoutData={workoutData}
                />
            )}

            {/* APP HEADER */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6 sm:mb-2">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-500 to-pink-500 dark:from-red-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[3px_3px_0px_#000000] animate-pulse" style={{ transform: 'skew(-10deg)' }}>
                        DUO-FIT
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Spidey-Analyze</p>
                    </div>
                </div>
                <div className="relative z-50 flex items-center gap-2">
                    {/* Previous Day Arrow */}
                    <button
                        onClick={() => {
                            const d = new Date(selectedDayKey);
                            d.setDate(d.getDate() - 1);
                            handleSelectDate(d);
                        }}
                        className="p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Previous Day"
                    >
                        <ChevronDown size={16} className="rotate-90" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 px-4 py-2.5 sm:py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Calendar size={16} className="text-emerald-500" />
                            {getDropdownLabel()}
                            <ChevronDown size={14} className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 flex flex-col z-[100]">
                                <button onClick={() => handleSelectDate(new Date())} className="px-5 py-4 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">Today</button>
                                <button onClick={() => { const d = new Date(); d.setDate(d.getDate() - 1); handleSelectDate(d); }} className="px-5 py-4 text-left text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">Yesterday</button>
                                <button onClick={() => { setIsCalendarOpen(true); setIsDropdownOpen(false); }} className="px-5 py-4 text-left text-sm font-bold text-emerald-600 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">Select Date <Calendar size={14} /></button>
                            </div>
                        )}
                    </div>

                    {/* Next Day Arrow */}
                    <button
                        onClick={() => {
                            const d = new Date(selectedDayKey);
                            d.setDate(d.getDate() + 1);
                            handleSelectDate(d);
                        }}
                        disabled={selectedDayKey === getTodayStr()}
                        className={`p-2 sm:p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors ${selectedDayKey === getTodayStr()
                            ? 'bg-transparent text-zinc-300 dark:text-zinc-800 cursor-not-allowed'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                            }`}
                        aria-label="Next Day"
                    >
                        <ChevronDown size={16} className="-rotate-90" />
                    </button>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* ZONE 1: TODAY • Your Progress (Primary Emphasis)                          */}
            {/* ========================================================================= */}
            <SectionHeader
                title={(() => {
                    if (selectedDayKey === getTodayStr()) return 'TODAY';
                    if (selectedDayKey === getYesterdayStr()) return 'YESTERDAY';
                    const [y, m, d] = selectedDayKey.split('-').map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                })()}
                subtitle={selectedDayKey === getTodayStr() ? "Your Active Progress" : "Historical Record"}
                icon={Activity}
                type="primary"
                color="text-indigo-500"
            />

            <div className="space-y-4">
                {/* Hero Card - The most prominent element */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-[2.1rem] opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                    <HeroStatsCard stats={activeDayStats} streak={history.currentStreak} theme={theme} />
                </div>

                {/* Today's Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <DualMetricCard
                        title="Cardio Session"
                        icon={Clock}
                        left={{
                            value: activeDayStats?.cDist > 0 ? activeDayStats.cDist.toFixed(1) : '---',
                            unit: activeDayStats?.cDist > 0 ? 'km' : '',
                            label: 'Distance',
                            subtext: activeDayStats?.cDistMin > 0 ? `${activeDayStats.cDistMin} min pace` : null
                        }}
                        right={{
                            value: activeDayStats?.cCircuitMin > 0 ? activeDayStats.cCircuitMin.toFixed(2) : (activeDayStats?.cDist === 0 ? '---' : '0'),
                            unit: activeDayStats?.cCircuitMin > 0 ? 'min' : '',
                            label: 'Circuit',
                            subtext: 'High Intensity'
                        }}
                        theme={theme}
                    />
                    <DualMetricCard
                        title="Core Volume"
                        icon={Layers}
                        left={{
                            value: activeDayStats?.aRep > 0 ? activeDayStats.aRep : '---',
                            unit: activeDayStats?.aRep > 0 ? 'reps' : '',
                            label: 'Reps',
                            subtext: 'Crunches / Leg Raises'
                        }}
                        right={{
                            value: activeDayStats?.aHold > 0 ? (() => {
                                const m = Math.floor(activeDayStats.aHold / 60);
                                const s = Math.round(activeDayStats.aHold % 60);
                                return `${m}:${s.toString().padStart(2, '0')}`;
                            })() : '---',
                            unit: activeDayStats?.aHold > 0 ? 'mm:ss' : '',
                            label: 'Holds',
                            subtext: 'Planks / Isometrics'
                        }}
                        theme={theme}
                    />
                </div>
            </div>

            {/* ========================================================================= */}
            {/* ZONE 2: RECENT TRENDS (Muted, Analytical)                                 */}
            {/* ========================================================================= */}
            <div className="mt-16">
                <SectionHeader
                    title="Recent Trends"
                    subtitle="Performance Over Time"
                    icon={TrendingUp}
                    iconColor="text-pink-500"
                    color="text-pink-500"
                />
            </div>

            <div className="space-y-4">
                {/* Performance Trend Cards */}
                <AnalyticsTrends history={history} theme={theme} />
            </div>

            {/* ========================================================================= */}
            {/* ZONE 3: CONSISTENCY & HABITS (Warm, Motivational)                         */}
            {/* ========================================================================= */}
            {/* ========================================================================= */}
            {/* ZONE 3: CONSISTENCY & HABITS (Warm, Motivational)                         */}
            {/* ========================================================================= */}
            <div className="mt-12">
                <SectionHeader
                    title="Consistency & Habits"
                    subtitle="Long-Term Discipline"
                    icon={Award}
                    color="text-amber-500"
                />
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-8">
                {/* Streak Card - Warm Emphasis */}
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 shadow-xl shadow-orange-500/20 flex flex-col justify-between overflow-hidden text-white group min-h-[160px] border border-orange-400/20">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform"><Zap className="w-24 h-24 text-white" /></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2"><div className="p-1.5 rounded-full bg-white/20"><Zap className="w-3.5 h-3.5" /></div><span className="text-xs font-bold uppercase tracking-widest opacity-90">Current Streak</span></div>
                        <div className="text-4xl font-black tracking-tighter drop-shadow-sm">{history.currentStreak} <span className="text-lg font-bold opacity-80 tracking-widest">Days</span></div>
                        <div className="text-sm font-medium opacity-95">{history.currentStreak > 3 ? "You are displaying elite consistency." : "Momentum builds one day at a time."}</div>
                    </div>
                </div>

                {/* Discipline Score */}
                {(() => {
                    const isLocked = history.userStage < 5;
                    const progress = Math.min(history.totalWorkouts, 15);
                    const pct = (progress / 15) * 100;
                    return (
                        <div className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between overflow-hidden min-h-[160px]">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest z-10">Discipline Score</h3>
                            {isLocked ? (
                                <div className="z-10 mt-auto">
                                    <span className="text-2xl font-black text-zinc-300 block mb-2">LOCKED</span>
                                    <div className="w-full h-2 bg-zinc-100 rounded-full mb-2"><div className="h-full bg-indigo-500" style={{ width: `${pct}%` }}></div></div>
                                    <div className="text-xs font-bold text-zinc-400">{progress}/15 to Unlock</div>
                                </div>
                            ) : (
                                <div className="z-10 mt-auto">
                                    <div className="text-5xl font-black text-indigo-500 tracking-tighter mb-1">{history.discipline}%</div>
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Consistency Rating</div>
                                </div>
                            )}
                        </div>
                    )
                })()}

                {/* Monthly Summary */}
                {activeStreak >= 14 && (
                    <div className="md:col-span-2 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 shadow-sm">
                        <div className="text-center"><div className="text-2xl font-black text-zinc-800 dark:text-zinc-200">{history.monthlyStats?.sessions || 0}</div><div className="text-[10px] font-bold text-zinc-400 uppercase">Sessions</div></div>
                        <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="text-center"><div className="text-2xl font-black text-emerald-500">{activeStreak}</div><div className="text-[10px] font-bold text-zinc-400 uppercase">Peak Streak</div></div>
                        <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="text-center"><div className="text-2xl font-black text-blue-500">{history.monthlyStats?.topFocus || "-"}</div><div className="text-[10px] font-bold text-zinc-400 uppercase">Top Focus</div></div>
                    </div>
                )}
            </div>

            {/* Workout Focus - Compact, Less Prominent */}
            {history.totalWorkouts > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Training Balance</span>
                        <span className="text-[9px] text-zinc-400">Last {history.recentSessionCount} sessions</span>
                    </div>
                    <div className="flex items-center gap-4 justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{history.recentDistribution?.[0] || 0} Strength</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{history.recentDistribution?.[1] || 0} Cardio</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{history.recentDistribution?.[2] || 0} Core</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State Footer (Stage 0 only) */}
            {activeWorkouts === 0 && (
                <div className="flex justify-center py-8">
                    <button className="px-8 py-3 rounded-full bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 animate-pulse hover:bg-emerald-400 transition-colors">Start First Workout →</button>
                </div>
            )}
        </div>
    );
};

export const StatsView = (props) => (
    <ErrorBoundary>
        <StatsViewUnsafe {...props} />
    </ErrorBoundary>
);
