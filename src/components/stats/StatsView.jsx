import React, { useMemo } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export const StatsView = ({ workoutData }) => {
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

        // Use Volume-Consistency for Discipline if meaningful, otherwise fallback to sets
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

    // Chart Options for "Glow" look
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(24, 24, 27, 0.9)',
                titleColor: '#fff',
                bodyColor: '#a1a1aa',
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
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
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
        <div className="p-4 pb-32 space-y-6 animate-in fade-in duration-700">

            <div className="space-y-6 mb-8">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                        PERFORMANCE HUB
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Spidey-Sense Analysis</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm">
                        <span className="text-3xl font-black text-amber-500 italic drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{stats.currentStreak}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1">Day Streak</span>
                    </div>
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm">
                        <span className="text-3xl font-black text-emerald-500 italic drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{stats.totalWorkouts}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1">Sessions</span>
                    </div>
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm">
                        <span className="text-2xl font-black text-blue-500 italic drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{(stats.totalVol / 1000).toFixed(1)}k</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1">Vol (kg)</span>
                    </div>
                    {/* Discipline KPI */}
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm relative overflow-hidden group">
                        <span className={`text-2xl font-black italic drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] ${stats.discipline >= 90 ? 'text-green-500' : stats.discipline >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {stats.discipline}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1">Discipline</span>
                        {/* Negative Progress Hint */}
                        {stats.discipline < 100 && (
                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500/50 animate-pulse" title="Missed Gains detected"></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. Training Distribution (Doughnut) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
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
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Focus</span>
                            </div>
                        </div>

                        {/* Percentages Legend */}
                        <div className="flex flex-col gap-2 w-full sm:w-auto flex-grow">
                            {/* Strength */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-zinc-400">Strength</span>
                                </div>
                                <span className="text-xs font-bold text-zinc-200">
                                    {Math.round((stats.distribution[0] / (stats.distribution.reduce((a, b) => a + b, 0) || 1)) * 100)}%
                                </span>
                            </div>
                            {/* Cardio */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                    <span className="text-xs text-zinc-400">Cardio</span>
                                </div>
                                <span className="text-xs font-bold text-zinc-200">
                                    {Math.round((stats.distribution[1] / (stats.distribution.reduce((a, b) => a + b, 0) || 1)) * 100)}%
                                </span>
                            </div>
                            {/* Core */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                    <span className="text-xs text-zinc-400">Core</span>
                                </div>
                                <span className="text-xs font-bold text-zinc-200">
                                    {Math.round((stats.distribution[2] / (stats.distribution.reduce((a, b) => a + b, 0) || 1)) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Strength Volume (Bar) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
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

                {/* 3. Cardio Output (Dual Axis) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
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
                                    {
                                        label: 'Minutes',
                                        data: stats.cMin,
                                        backgroundColor: 'rgba(236, 72, 153, 0.7)',
                                        borderRadius: 4,
                                        barThickness: 12,
                                        yAxisID: 'y',
                                        order: 1
                                    },
                                    {
                                        label: 'Distance (km)',
                                        data: stats.cDist,
                                        backgroundColor: 'rgba(6, 182, 212, 0.7)',
                                        borderRadius: 4,
                                        barThickness: 12,
                                        yAxisID: 'y1',
                                        order: 2
                                    }
                                ]
                            }}
                            options={{
                                ...commonOptions,
                                plugins: {
                                    ...commonOptions.plugins,
                                    tooltip: { ...commonOptions.plugins.tooltip, displayColors: true }
                                },
                                scales: {
                                    x: { grid: { color: '#27272a' }, ticks: { color: '#71717a', font: { size: 10 } } },
                                    y: {
                                        type: 'linear',
                                        display: true,
                                        position: 'left',
                                        beginAtZero: true,
                                        grid: { color: '#27272a' },
                                        ticks: { color: '#ec4899', font: { size: 10 } } // Pink ticks for time
                                    },
                                    y1: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',
                                        beginAtZero: true,
                                        grid: { drawOnChartArea: false }, // Only show grid for left axis to look cleaner
                                        ticks: { color: '#06b6d4', font: { size: 10 } } // Cyan ticks for distance
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* 4. Core Intensity (Bar) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
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
