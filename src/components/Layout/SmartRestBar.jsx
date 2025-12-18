import React from 'react';
import { Timer, Plus, X, Play } from 'lucide-react';
import { Button } from '../ui/Button';

export const SmartRestBar = ({
    isActive,
    timeLeft,
    onStart,
    onAdd,
    onStop,
    userProfile
}) => {
    // Format time mm:ss
    const formatTime = (ms) => {
        if (ms <= 0) return "00:00";
        const totalSeconds = Math.ceil(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const barColor = userProfile === 'gwen'
        ? 'border-pink-500/30 bg-white/90 dark:bg-zinc-900/90 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
        : 'border-red-500/30 bg-white/90 dark:bg-zinc-900/90 shadow-[0_0_20px_rgba(220,38,38,0.15)]';

    const progressColor = userProfile === 'gwen' ? 'bg-pink-500' : 'bg-red-600';

    // Calculate progress width for bar
    // Assuming 90s max for visual bar, or just pulse effect

    if (!isActive) {
        return (
            <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 animate-in slide-in-from-bottom-5 duration-500`}>
                <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border ${barColor} p-2 flex items-center gap-3`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${userProfile === 'gwen' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                        <Timer size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Rest Timer</h3>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Ready for next set?</p>
                    </div>

                    <Button
                        onClick={() => onStart(60)}
                        className={`h-12 px-6 rounded-xl font-black italic tracking-widest ${userProfile === 'gwen' ? 'bg-pink-500 text-white hover:bg-pink-400' : 'bg-red-600 text-white hover:bg-red-500'} shadow-lg`}
                    >
                        REST 60s
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[95%] max-w-[500px] z-50 animate-in slide-in-from-bottom-5 duration-300`}>
            <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border-2 ${barColor} p-1`}>

                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-zinc-200 dark:bg-zinc-800">
                    <div className={`h-full ${progressColor} transition-all duration-1000 ease-linear`} style={{ width: `${Math.min((timeLeft / 60000) * 100, 100)}%` }}></div>
                </div>

                <div className="flex items-center justify-between gap-2 p-2 relative z-10">

                    {/* Time Display */}
                    <div className={`flex items-center justify-center w-24 h-14 rounded-xl ${userProfile === 'gwen' ? 'bg-pink-50 dark:bg-pink-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <span className={`text-3xl font-black tabular-nums tracking-tighter ${userProfile === 'gwen' ? 'text-pink-600 dark:text-pink-400' : 'text-red-600 dark:text-red-500'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        <Button
                            onClick={onAdd}
                            className="h-14 flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0 rounded-xl"
                        >
                            <div className="flex flex-col items-center leading-none">
                                <Plus size={20} />
                                <span className="text-[10px] font-bold">+30s</span>
                            </div>
                        </Button>

                        <Button
                            onClick={onStop}
                            className="h-14 w-20 flex flex-col items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border-0 rounded-xl shadow-md"
                        >
                            <span className="text-xs font-black uppercase tracking-widest">STOP</span>
                            <X size={16} className="mt-0.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
