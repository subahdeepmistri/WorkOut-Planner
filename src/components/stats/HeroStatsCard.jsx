import React from 'react';
import { Zap, Clock, Activity, Trophy } from 'lucide-react';

export const HeroStatsCard = ({ stats, streak, theme }) => {
    // defaults
    const volume = stats?.strengthVol || 0;
    const duration = stats?.cMin || 0; // wait, cMin is cardio. Session duration?
    // statsEngine returns 'duration' string "50m".
    // I might need raw minutes for formatting.
    // Let's rely on props passed.

    const volDisplay = volume >= 1000 ? `${(volume / 1000).toFixed(1)}k` : volume;
    const hasVolume = volume > 0;

    return (
        <div className="relative w-full p-6 sm:p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden group">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

                {/* Primary Metric (Volume or Duration) */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50">
                            {hasVolume ? <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" /> : <Clock className="w-4 h-4 text-pink-400" />}
                        </div>
                        <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">
                            {hasVolume ? "Training Volume" : "Session Duration"}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
                            {hasVolume ? volDisplay : (stats?.duration || '0m')}
                        </h1>
                        {hasVolume && <span className="text-xl font-medium text-zinc-500">kg</span>}
                    </div>
                </div>

                {/* Secondary Stats Row (Pills) */}
                <div className="flex flex-wrap gap-3">
                    {/* Duration Pill (if Vol is Hero) */}
                    {hasVolume && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-sm font-bold text-zinc-200">{stats?.duration || '0m'}</span>
                        </div>
                    )}

                    {/* Streak Pill */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-sm font-bold text-zinc-200">{streak} Day Streak</span>
                    </div>

                    {/* Cardio Pill (if relevant) */}
                    {stats?.cMin > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
                            <Activity className="w-3.5 h-3.5 text-pink-400" />
                            <span className="text-sm font-bold text-zinc-200">{Math.round(stats.cMin)}m Cardio</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
