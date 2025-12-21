import React, { useMemo, useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Info } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/**
 * TrendCard - Coach-Enhanced & Context Aware
 */
const TrendCard = ({ title, data, labels, color, type = 'line', category, theme }) => {
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);

    // 1. Analyze Trend (Context-Aware Vocabulary)
    const trend = useMemo(() => {
        if (!data || data.length < 2) return { diff: 0, dir: 'neutral', label: 'Calibrating', sub: 'Gathering initial data' };

        const current = data[data.length - 1];
        const prev = data[data.length - 2];
        const diff = current - prev;
        const pct = prev !== 0 ? Math.round((diff / prev) * 100) : 0;

        let label = "Steady";
        let sub = "Maintaining baseline";
        let dir = 'stable';

        // --- Vocabulary Engine ---
        if (pct > 5) { // GROWTH
            dir = 'up';
            if (category === 'strength') {
                label = pct > 15 ? "New Peak" : "Progressive";
                sub = "Overload principle active";
            } else if (category === 'cardio') {
                label = "Capacity Building";
                sub = "Engine is expanding";
            } else { // Core
                label = "Solidifying";
                sub = "Core density increasing";
            }
        }
        else if (pct < -5) { // DROP
            dir = 'down';
            if (category === 'strength') {
                label = "Deload Phase";
                sub = "Strategic recovery active";
            } else if (category === 'cardio') {
                label = "Recovery Mode";
                sub = "Active recovery session";
            } else {
                label = "Reset";
                sub = "Rebuilding foundation";
            }
        }
        else { // STABLE (-5 to 5)
            dir = 'stable';
            if (category === 'strength') {
                label = "Maintenance";
                sub = "Preserving muscle mass";
            } else if (category === 'cardio') {
                label = "Base Building";
                sub = "Aerobic base work";
            } else {
                label = "Consistent";
                sub = "Habit formation locked";
            }
        }

        return { diff: Math.abs(pct), dir, label, sub, rawPct: pct };
    }, [data, category]);

    // 2. Chart Options (Premium Polish)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20, bottom: 5, left: -10, right: 0 } },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        scales: {
            x: { display: false },
            y: { display: false, min: Math.min(...(data || [])) * 0.85 }
        },
        elements: {
            point: {
                radius: (ctx) => ctx.dataIndex === data.length - 1 ? 7 : 0, // Larger "Now" dot
                hitRadius: 30,
                backgroundColor: color,
                borderColor: isDark ? '#18181b' : '#fff',
                borderWidth: 3,
            },
            line: {
                borderWidth: 3,
                tension: 0.4,
                capBezierPoints: true
            }
        },
        animation: {
            duration: 2500, // Even slower, 2.5s
            easing: 'easeOutQuart'
        }
    };

    // 3. Chart Data
    const chartData = {
        labels: labels || [],
        datasets: [{
            data: data || [],
            borderColor: color,
            backgroundColor: (context) => {
                if (type !== 'area') return 'transparent';
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, color.replace(')', ', 0.15)').replace('rgb', 'rgba')); // More subtle fill
                gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
                return gradient;
            },
            fill: type === 'area'
        }]
    };

    // Hierarchy Styles (Shadows/Borders)
    const hierarchyClass =
        category === 'strength' ? 'shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 border-indigo-100 dark:border-indigo-900/30' :
            category === 'cardio' ? 'shadow-md shadow-pink-500/5 hover:shadow-pink-500/10 border-zinc-200 dark:border-zinc-800' :
                'shadow-sm hover:shadow-md border-zinc-200 dark:border-zinc-800';

    return (
        <div
            className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border transition-all duration-500 flex flex-col justify-between h-64 relative overflow-hidden group cursor-default ${hierarchyClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header - Soft Typography */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    {/* Title: No Uppercase, simple semibold */}
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{title}</h3>

                    {/* Interactive Coach Pill */}
                    <div className={`
                        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-300
                        ${isHovered
                            ? (trend.dir === 'up' ? 'bg-emerald-500 text-white' : trend.dir === 'down' ? 'bg-amber-500 text-white' : 'bg-zinc-200 text-zinc-600')
                            : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border border-zinc-100 dark:border-zinc-800'
                        }
                    `}>
                        {isHovered ? (
                            <span className="flex items-center gap-1">
                                {trend.dir === 'up' ? <ArrowUpRight size={10} /> : trend.dir === 'down' ? <ArrowDownRight size={10} /> : <Minus size={10} />}
                                {trend.rawPct > 0 ? '+' : ''}{trend.rawPct}%
                            </span>
                        ) : (
                            <span>{trend.label}</span>
                        )}
                    </div>
                </div>

                {/* Big Number + Pulse */}
                <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                        {data[data.length - 1]?.toLocaleString() || '-'}
                    </span>
                    {/* Subtle Pulse */}
                    {trend.dir === 'up' && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    )}
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-grow w-full relative -ml-1">
                <Line data={chartData} options={options} />
            </div>

            {/* Insight Footer (Micro Insight) */}
            <div className="mt-2 pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
                <p className="text-[10px] font-medium text-zinc-400 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Info size={12} className="text-zinc-300 dark:text-zinc-600" />
                    {trend.sub}
                </p>
            </div>
        </div>
    );
};

export const AnalyticsTrends = ({ history, theme }) => {
    // Safety check
    if (!history || history.totalWorkouts < 2) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60">
                <TrendingUp className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-sm font-semibold text-zinc-400">Trends unlock after 2 workouts</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 px-1 flex items-center gap-2">
                Performance Trends
                <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-normal">Last 5 Sessions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">

                {/* 1. Strength - High Priority */}
                <TrendCard
                    title="Strength Load"
                    data={history.datasets.sVol}
                    labels={history.labels}
                    color="#6366f1"
                    category="strength"
                    theme={theme}
                />

                {/* 2. Cardio - Medium Priority */}
                <TrendCard
                    title="Cardio Output"
                    data={history.datasets.cLoad}
                    labels={history.labels}
                    color="#ec4899"
                    type="area"
                    category="cardio"
                    theme={theme}
                />

                {/* 3. Core - Low Priority */}
                <TrendCard
                    title="Core Volume"
                    data={history.datasets.aRep}
                    labels={history.labels}
                    color="#10b981"
                    category="core"
                    theme={theme}
                />
            </div>
        </div>
    );
};
