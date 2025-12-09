import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { parseTargetReps } from '../../utils/helpers';

export const SetRow = ({ set, index, onChange, onRemove, previousBest, targetReps, isCardio, cardioMode, isAbs, disabled, onRest }) => {
    const reps = set.reps || 0;
    const targetNum = parseTargetReps(targetReps);
    const target = targetNum || 1;


    // Helper to determine bar color
    const getProgressBarColor = (reps, target) => {
        const r = parseFloat(reps);
        const t = parseFloat(target);
        if (!r || !t) return { bar: 'bg-zinc-300 dark:bg-zinc-700', glow: '' };
        if (r < t) return { bar: 'bg-yellow-500', glow: '' };
        if (r === t) return { bar: 'bg-green-500', glow: '' };
        return { bar: 'bg-purple-500', glow: 'shadow-[0_0_10px_rgba(168,85,247,0.8)]' };
    };

    const { bar: barColor, glow: glowClass } = getProgressBarColor(reps, target);


    // Helper for safe numeric input change
    const handleNumChange = (field, value) => {
        // Allow empty string to clear input
        if (value === '') {
            onChange(index, field, value);
            return;
        }
        // Check for negative
        const num = parseFloat(value);
        if (!isNaN(num) && num >= 0) {
            onChange(index, field, value);
        }
    };

    if (isCardio) {
        const isDistance = cardioMode === 'distance';
        return (
            <div className="py-3 border-b border-pink-200 dark:border-pink-900/10 last:border-0 relative">
                {isDistance ? (
                    <div className="grid gap-2 items-center grid-cols-[24px_1fr_auto]">
                        {/* Index */}
                        <span className="text-pink-600/70 text-sm font-mono text-center">{index + 1}</span>
                        {/* Inputs Container */}
                        <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                            <input type="number" min="0" dir="rtl" disabled={disabled} value={set.distance || ''} onChange={(e) => handleNumChange('distance', e.target.value)} placeholder="km" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 font-bold rounded-t-md transition-colors" />
                            <input type="number" min="0" dir="rtl" disabled={disabled} value={set.time || ''} onChange={(e) => handleNumChange('time', e.target.value)} placeholder="min" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 font-bold rounded-t-md transition-colors" />
                            <input type="text" dir="rtl" disabled={disabled} value={set.pace || ''} onChange={(e) => onChange(index, 'pace', e.target.value)} placeholder="/km" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 font-bold rounded-t-md transition-colors" />
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1 justify-center items-center">
                            <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-11 h-11 p-2 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'} disabled:opacity-50`}><CheckCircle size={20} /></button>
                            <button disabled={disabled} onClick={() => onRemove()} className="w-11 h-11 flex items-center justify-center transition-colors bg-transparent text-zinc-600 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 active:scale-95"><X size={20} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-2 items-center grid-cols-[24px_1fr_auto]">
                        {/* Index */}
                        <span className="text-pink-600/70 text-sm font-mono text-center">{index + 1}</span>
                        {/* Inputs Container */}
                        <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                            <input type="number" min="0" dir="rtl" disabled={disabled} value={set.reps || ''} onChange={(e) => handleNumChange('reps', e.target.value)} placeholder="Reps" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 rounded-t-md transition-colors font-bold" />
                            <input type="text" disabled={disabled} value={set.duration || ''} onChange={(e) => onChange(index, 'duration', e.target.value)} placeholder="Duration" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 rounded-t-md transition-colors font-bold" />
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1 justify-center items-center">
                            <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-11 h-11 p-2 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'} disabled:opacity-50`}><CheckCircle size={20} /></button>
                            <button disabled={disabled} onClick={() => onRemove()} className="w-11 h-11 flex items-center justify-center transition-colors bg-transparent text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 active:scale-95"><X size={20} /></button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (isAbs) {
        return (
            <div className="py-2">
                <div className="py-2">
                    <div className="grid gap-3 items-center grid-cols-[24px_1fr_auto]">
                        <span className="text-cyan-600/70 text-sm font-mono text-center">{index + 1}</span>
                        <div className="relative w-full"><input type="number" min="0" disabled={disabled} value={set.reps || ''} onChange={(e) => handleNumChange('reps', e.target.value)} placeholder="Reps / Hold" className="w-full bg-cyan-50/50 dark:bg-zinc-900/50 border-b border-cyan-200 dark:border-cyan-900/50 focus:border-cyan-500 px-2 py-3 text-center font-mono text-cyan-900 dark:text-cyan-100 outline-none placeholder:text-cyan-700/50 dark:placeholder:text-zinc-700 disabled:opacity-50 font-bold rounded-t-md transition-colors" /></div>
                        <div className="flex gap-1 justify-center items-center">
                            <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-11 h-11 p-2 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700'} disabled:opacity-50 border border-zinc-300 dark:border-zinc-700`}><CheckCircle size={20} /></button>
                            <button disabled={disabled} onClick={() => onRemove()} className="w-11 h-11 flex items-center justify-center transition-colors text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 active:scale-95"><X size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const defaultTarget = parseTargetReps(targetReps) || 0;
    const rowTarget = set.target !== undefined ? set.target : defaultTarget;
    return (
        <div className="py-2">
            <div className="grid gap-2 items-center grid-cols-[24px_1fr_auto]">
                {/* Index */}
                <span className="text-zinc-600 text-sm font-mono text-center">{index + 1}</span>

                {/* Inputs Container */}
                <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                    <div className="relative"><input type="number" min="0" disabled={disabled} value={set.target !== undefined ? set.target : (defaultTarget || '')} onChange={(e) => handleNumChange('target', e.target.value)} placeholder={defaultTarget || '-'} className="w-full bg-green-50/50 dark:bg-zinc-900/50 border-b border-green-200 dark:border-green-900/30 text-green-900 dark:text-green-500/70 focus:border-green-500 px-1 py-3 text-center font-mono outline-none disabled:opacity-50 font-bold rounded-t-md transition-colors placeholder:text-green-700/50 dark:placeholder:text-green-500/30" /></div>

                    <div className="relative"><input type="number" min="0" disabled={disabled} value={set.weight || ''} onChange={(e) => handleNumChange('weight', e.target.value)} placeholder="kg" className="w-full bg-green-50/50 dark:bg-zinc-900/50 border-b border-green-200 dark:border-green-900/30 focus:border-green-500 px-2 py-3 text-center font-mono text-green-900 dark:text-green-100 outline-none disabled:opacity-50 font-bold rounded-t-md transition-colors placeholder:text-green-700/50 dark:placeholder:text-green-500/30" />{previousBest && (<div className="absolute -top-5 left-0 w-full text-center text-[10px] text-green-600/70 dark:text-green-500/50">Best: {previousBest.weight}kg</div>)}</div>

                    <div className="relative"><input type="number" min="0" disabled={disabled} value={set.reps || ''} onChange={(e) => handleNumChange('reps', e.target.value)} placeholder="-" className="w-full bg-green-50/50 dark:bg-zinc-900/50 border-b border-green-200 dark:border-green-900/30 focus:border-green-500 px-2 py-3 text-center font-mono text-green-900 dark:text-green-100 outline-none disabled:opacity-50 font-bold rounded-t-md transition-colors placeholder:text-green-700/50 dark:placeholder:text-green-500/30" /></div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 justify-center items-center">
                    <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-11 h-11 p-2 rounded flex items-center justify-center transition-colors mb-0 ${set.completed ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'} disabled:opacity-50`}><CheckCircle size={20} /></button>
                    <button disabled={disabled} onClick={() => onRemove()} className="w-11 h-11 flex items-center justify-center transition-colors text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 active:scale-95"><X size={20} /></button>
                </div>
            </div>

            <div className="flex px-1 mt-1">
                <div className="w-[24px] mr-2"></div><div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-200 dark:border-transparent"><div className={`h-full rounded-sm transition-all duration-300 ease-out ${barColor} ${glowClass}`} style={{ width: `${Math.min((reps / (rowTarget || 1)) * 100, 100)}%` }} /></div><div className="w-[110px] ml-2"></div>
            </div>
        </div>
    );
};
