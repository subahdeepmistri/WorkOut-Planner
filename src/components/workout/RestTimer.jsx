import React from 'react';

export const RestTimer = ({ timeLeft, onAdd, onSubtract, onStop }) => {
    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 pointer-events-none flex justify-center">
            <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-2xl rounded-2xl p-4 w-full max-w-sm flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Resting</span>
                    <span className="text-3xl font-mono font-bold text-white tracking-widest tabular-nums">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onSubtract(10)} className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-bold text-xs">-10</button>
                    <button onClick={() => onAdd(30)} className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-bold text-xs">+30</button>
                    <button onClick={onStop} className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center justify-center border border-red-500/50">
                        <div className="w-3 h-3 bg-current rounded-sm" />
                    </button>
                </div>
            </div>
        </div>
    );
};
