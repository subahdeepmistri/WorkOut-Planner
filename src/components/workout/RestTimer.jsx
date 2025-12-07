import React from 'react';
import { RotateCcw, Plus, X } from 'lucide-react';

export const RestTimer = ({ timeLeft, onAdd, onStop }) => {
    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="w-full h-full flex items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Time Display */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.2em] animate-pulse">Resting</span>
                    <span className="text-3xl font-mono font-black text-white leading-none tracking-tight tabular-nums relative top-0.5">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(-10); }}
                    className="h-8 px-2 sm:h-9 sm:px-3 rounded bg-red-900/40 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-[10px] transition-colors"
                >
                    -10
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(15); }}
                    className="h-8 px-2 sm:h-9 sm:px-3 rounded bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-[10px] transition-colors"
                >
                    +15
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(30); }}
                    className="h-8 px-2 sm:h-9 sm:px-3 rounded bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-[10px] transition-colors"
                >
                    +30
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onStop(); }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors ml-1"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
