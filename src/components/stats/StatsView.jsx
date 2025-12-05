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
        const sVol = [], cMin = [], aRep = [], lbs = [];
        let sCount = 0, cCount = 0, aCount = 0;

        dates.forEach(d => {
            const day = workoutData[d]; if (!day) return;
            let sv = 0, cm = 0, ar = 0, has = false;
            day.exercises.forEach(ex => {
                let exIsActive = false;
                ex.sets.forEach(s => {
                    if (s.completed) {
                        has = true; exIsActive = true;
                        if (ex.type === 'abs') { ar += (s.reps || 0) + (parseFloat(s.holdTime) || 0); }
                        else if (ex.type === 'cardio') cm += (s.time || 0);
                        else sv += (s.weight || 0) * (s.reps || 0);
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
                aRep.push(ar);
            }
        });

        return {
            labels: lbs, sVol, cMin, aRep,
            distribution: [sCount, cCount, aCount]
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
            y: { grid: { color: '#27272a' }, ticks: { color: '#71717a', font: { size: 10 } } }
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

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                        PERFORMANCE HUB
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Spidey-Sense Analysis</p>
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
                    <div className="h-48 relative">
                        <Doughnut
                            data={{
                                labels: ['Strength', 'Cardio', 'Core'],
                                datasets: [{
                                    data: stats.distribution,
                                    backgroundColor: ['#22c55e', '#ec4899', '#06b6d4'],
                                    borderColor: '#18181b',
                                    borderWidth: 5
                                }]
                            }}
                            options={doughnutOptions}
                        />
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Focus</span>
                        </div>
                    </div>
                </div>

                {/* 2. Strength Volume (Line) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            Strength Volume
                        </h3>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Kg x Reps</span>
                    </div>
                    <div className="h-48">
                        <Line
                            data={{
                                labels: stats.labels,
                                datasets: [{
                                    data: stats.sVol,
                                    borderColor: '#22c55e',
                                    backgroundColor: (context) => {
                                        const ctx = context.chart.ctx;
                                        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                                        gradient.addColorStop(0, "rgba(34,197,94,0.4)");
                                        gradient.addColorStop(1, "rgba(34,197,94,0)");
                                        return gradient;
                                    },
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    pointHoverRadius: 6
                                }]
                            }}
                            options={commonOptions}
                        />
                    </div>
                </div>

                {/* 3. Cardio Duration (Bar) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                            Cardio Output
                        </h3>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Minutes</span>
                    </div>
                    <div className="h-48">
                        <Bar
                            data={{
                                labels: stats.labels,
                                datasets: [{
                                    data: stats.cMin,
                                    backgroundColor: '#ec4899',
                                    borderRadius: 4,
                                    barThickness: 10
                                }]
                            }}
                            options={commonOptions}
                        />
                    </div>
                </div>

                {/* 4. Core Intensity (Area) */}
                <div className="col-span-1 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 shadow-xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                            Core Endurance
                        </h3>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Reps + Hold (s)</span>
                    </div>
                    <div className="h-48">
                        <Line
                            data={{
                                labels: stats.labels,
                                datasets: [{
                                    data: stats.aRep,
                                    borderColor: '#06b6d4',
                                    backgroundColor: (context) => {
                                        const ctx = context.chart.ctx;
                                        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                                        gradient.addColorStop(0, "rgba(6,182,212,0.4)");
                                        gradient.addColorStop(1, "rgba(6,182,212,0)");
                                        return gradient;
                                    },
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    pointHoverRadius: 6
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
