import React from 'react';
import { Timer, Plus, Minus, X } from 'lucide-react';

export const HeaderRest = ({
    isActive,
    timeLeft,
    totalDuration,
    onStart,
    onAdd,
    onSubtract,
    onStop,
    userProfile
}) => {
    // Format time mm:ss
    const formatTime = (seconds) => {
        if (seconds <= 0) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const themeColor = userProfile === 'gwen' ? 'pink' : 'purple';
    const themeText = userProfile === 'gwen' ? 'text-pink-600 dark:text-pink-400' : 'text-purple-600 dark:text-purple-400';
    const themeBg = userProfile === 'gwen' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-purple-100 dark:bg-purple-900/30';
    const themeBorder = userProfile === 'gwen' ? 'border-pink-200 dark:border-pink-800' : 'border-purple-200 dark:border-purple-800';

    if (!isActive) {
        return (
            <button
                onClick={() => onStart(60)}
                className={`flex items-center justify-center p-3 rounded-2xl transition-all transform active:scale-95 shadow-md border-2 ${themeBorder} ${themeBg} hover:brightness-110`}
                title="Start Rest Timer (60s)"
            >
                <Timer size={32} className={themeText} strokeWidth={2.5} />
            </button>
        );
    }

    return (
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border ${themeBorder} ${themeBg}`}>

            {/* Circular Progress Timer */}
            <div className="relative w-14 h-14 flex items-center justify-center -ml-1">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                        className="text-black/10 dark:text-white/10"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    {/* Progress Ring */}
                    <path
                        className={`${userProfile === 'gwen' ? 'text-pink-500 dark:text-pink-400' : 'text-purple-600 dark:text-purple-400'} transition-all duration-300 ease-linear`}
                        strokeDasharray="100, 100"
                        strokeDashoffset={totalDuration > 0 ? 100 - ((timeLeft / totalDuration) * 100) : 0}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                {/* Time Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-[11px] font-black tabular-nums tracking-tighter ${themeText}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* -15s */}
                <button
                    onClick={() => onSubtract(15)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 text-zinc-600 dark:text-zinc-300 transition-colors"
                    title="-15s"
                >
                    <div className="flex flex-col items-center">
                        <Minus size={14} />
                        <span className="text-[8px] font-bold leading-none">-15</span>
                    </div>
                </button>

                {/* STOP */}
                <button
                    onClick={onStop}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900/10 dark:bg-white/10 hover:bg-zinc-900/20 dark:hover:bg-white/20 text-zinc-900 dark:text-white transition-colors"
                    title="Stop Timer"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                {/* +30s */}
                <button
                    onClick={() => onAdd(30)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 text-zinc-600 dark:text-zinc-300 transition-colors"
                    title="+30s"
                >
                    <div className="flex flex-col items-center">
                        <Plus size={14} />
                        <span className="text-[8px] font-bold leading-none">+30</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
