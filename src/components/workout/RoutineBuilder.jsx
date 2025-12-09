import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const RoutineBuilder = ({ onSave, onCancel }) => {
    const [name, setName] = useState("New Routine");

    return (
        <div className="relative overflow-hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 space-y-6">
                <div>
                    <h3 className="text-2xl font-black italic text-zinc-900 dark:text-white mb-1 tracking-tight">DESIGN ROUTINE</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Forge your protocol</p>
                </div>

                <div className="space-y-2 group">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider group-focus-within:text-emerald-500 transition-colors">Routine Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-zinc-50/50 dark:bg-black/20 backdrop-blur-sm p-4 rounded-xl text-zinc-900 dark:text-white font-bold tracking-wide border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/40 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm"
                        placeholder="ENTER NAME..."
                        autoFocus
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        onClick={() => onSave({ id: Date.now().toString(), name, exercises: [] })}
                        className="flex-1 py-3 text-sm bg-emerald-500/20 hover:bg-emerald-500/30 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 backdrop-blur-xl text-emerald-700 dark:text-emerald-300 font-bold tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] border border-emerald-500/30 transition-all active:scale-[0.98] rounded-xl"
                    >
                        START
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        className="flex-1 py-3 text-sm bg-zinc-500/10 hover:bg-zinc-500/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/50 dark:border-white/10 transition-all font-bold tracking-wide rounded-xl"
                    >
                        CANCEL
                    </Button>
                </div>
            </div>
        </div>
    );
};
