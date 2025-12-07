import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { parseTargetReps } from '../../utils/helpers';

export const SetRow = ({ set, index, onChange, onRemove, previousBest, targetReps, isCardio, cardioMode, isAbs, disabled, onRest }) => {
    const reps = set.reps || 0;
    const targetNum = parseTargetReps(targetReps);
    const target = targetNum || 1;


    // Helper to determine bar color
    const getProgressBarColor = (reps, target) => {
        if (!reps || !target) return { bar: 'bg-zinc-700', glow: '' };
        if (reps < target) return { bar: 'bg-yellow-500', glow: '' };
        if (reps === target) return { bar: 'bg-green-500', glow: '' };
        return { bar: 'bg-purple-500', glow: 'shadow-[0_0_10px_rgba(168,85,247,0.8)]' };
    };

    const { bar: barColor, glow: glowClass } = getProgressBarColor(reps, target);


    if (isCardio) {
        const isDistance = cardioMode === 'distance';
        return (
            <div className="py-3 border-b border-pink-900/10 last:border-0 relative">
                {isDistance ? (
                    <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '24px 1fr 1fr 1fr 110px' }}>
                        {/* Index */}
                        <span className="text-pink-600/70 text-sm font-mono text-center">{index + 1}</span>
                        {/* Inputs: Distance, Time, Pace */}
                        <input type="number" dir="rtl" disabled={disabled} value={set.distance || ''} onChange={(e) => onChange(index, 'distance', parseFloat(e.target.value))} placeholder="km" className="w-full bg-zinc-900/50 border-b border-pink-900/30 focus:border-pink-500 px-1 py-2 text-center font-mono text-pink-100 outline-none disabled:opacity-50 text-sm" />
                        <input type="number" dir="rtl" disabled={disabled} value={set.time || ''} onChange={(e) => onChange(index, 'time', parseFloat(e.target.value))} placeholder="min" className="w-full bg-zinc-900/50 border-b border-pink-900/30 focus:border-pink-500 px-1 py-2 text-center font-mono text-pink-100 outline-none disabled:opacity-50 text-sm" />
                        <input type="text" dir="rtl" disabled={disabled} value={set.pace || ''} onChange={(e) => onChange(index, 'pace', e.target.value)} placeholder="/km" className="w-full bg-zinc-900/50 border-b border-pink-900/30 focus:border-pink-500 px-1 py-2 text-center font-mono text-pink-100 outline-none disabled:opacity-50 text-sm" />

                        {/* Actions */}
                        <div className="flex gap-1 justify-center items-center">

                            <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-10 h-10 p-1.5 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 border border-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                            <button disabled={disabled} onClick={() => onRemove()} className="w-8 h-10 flex items-center justify-center transition-colors bg-transparent text-zinc-600 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50"><X size={16} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '24px 1fr 1fr 110px' }}>
                        {/* Index */}
                        <span className="text-pink-600/70 text-sm font-mono text-center">{index + 1}</span>
                        {/* Inputs: Reps, Duration */}
                        <input type="number" dir="rtl" disabled={disabled} value={set.reps || ''} onChange={(e) => onChange(index, 'reps', parseFloat(e.target.value))} placeholder="Reps" className="w-full bg-zinc-900/50 border-b border-pink-900/30 focus:border-pink-500 px-1 py-2 text-center font-mono text-pink-100 outline-none disabled:opacity-50 text-sm" />
                        <input type="text" disabled={disabled} value={set.duration || ''} onChange={(e) => onChange(index, 'duration', e.target.value)} placeholder="Duration" className="w-full bg-zinc-900/50 border-b border-pink-900/30 focus:border-pink-500 px-1 py-2 text-center font-mono text-pink-100 outline-none disabled:opacity-50 text-sm" />

                        {/* Actions */}
                        <div className="flex gap-1 justify-center items-center">

                            <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-10 h-10 p-1.5 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 border border-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                            <button disabled={disabled} onClick={() => onRemove()} className="w-8 h-10 flex items-center justify-center transition-colors bg-transparent text-zinc-600 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50"><X size={16} /></button>
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
                    <div className="grid gap-3 items-center" style={{ gridTemplateColumns: '24px 1fr 110px' }}>
                        <span className="text-cyan-600/70 text-sm font-mono text-center">{index + 1}</span>
                        <div className="relative"><input type="number" disabled={disabled} value={set.reps || ''} onChange={(e) => onChange(index, 'reps', parseFloat(e.target.value))} placeholder="Reps / Hold" className="w-full bg-zinc-900/50 border-b border-cyan-900/50 focus:border-cyan-500 px-2 py-2 text-center font-mono text-cyan-100 outline-none placeholder:text-zinc-700 disabled:opacity-50" /></div>
                        <div className="flex gap-1 justify-center items-center">

                            <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-10 h-10 p-1.5 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-cyan-500/20 text-cyan-500' : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                            <button disabled={disabled} onClick={() => onRemove()} className="w-8 h-10 flex items-center justify-center transition-colors text-zinc-600 hover:text-red-500 disabled:opacity-50"><X size={16} /></button>
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
            <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '24px minmax(50px, 0.6fr) minmax(60px, 1fr) minmax(60px, 1fr) 110px' }}>
                {/* Index */}
                <span className="text-zinc-600 text-sm font-mono text-center">{index + 1}</span>

                {/* Inputs */}
                <div className="relative"><input type="number" disabled={disabled} value={set.target !== undefined ? set.target : (defaultTarget || '')} onChange={(e) => onChange(index, 'target', parseFloat(e.target.value))} placeholder={defaultTarget || '-'} className="w-full bg-zinc-900/50 border-b border-green-900/30 text-green-500/70 focus:border-green-500 px-1 py-2 text-center font-mono outline-none disabled:opacity-50" /></div>

                <div className="relative"><input type="number" disabled={disabled} value={set.weight || ''} onChange={(e) => onChange(index, 'weight', parseFloat(e.target.value))} placeholder="kg" className="w-full bg-zinc-900/50 border-b border-green-900/30 focus:border-green-500 px-2 py-2 text-center font-mono text-green-100 outline-none disabled:opacity-50" />{previousBest && (<div className="absolute -top-5 left-0 w-full text-center text-[10px] text-green-500/50">Best: {previousBest.weight}kg</div>)}</div>

                <div className="relative"><input type="number" disabled={disabled} value={set.reps || ''} onChange={(e) => onChange(index, 'reps', parseFloat(e.target.value))} placeholder="-" className="w-full bg-zinc-900/50 border-b border-green-900/30 focus:border-green-500 px-2 py-2 text-center font-mono text-green-100 outline-none disabled:opacity-50" /></div>

                {/* Actions */}
                <div className="flex gap-1 justify-center items-center">

                    <button disabled={disabled} onClick={() => onChange(index, 'completed', !set.completed)} className={`w-10 h-10 p-1.5 rounded flex items-center justify-center transition-colors mb-0 ${set.completed ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                    <button disabled={disabled} onClick={() => onRemove()} className="w-8 h-10 flex items-center justify-center transition-colors text-zinc-600 hover:text-red-500 disabled:opacity-50"><X size={16} /></button>
                </div>
            </div>

            <div className="flex px-1 mt-1">
                <div className="w-[24px] mr-2"></div><div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-300 ease-out ${barColor} ${glowClass}`} style={{ width: `${Math.min((reps / (rowTarget || 1)) * 100, 100)}%` }} /></div><div className="w-[110px] ml-2"></div>
            </div>
        </div>
    );
};
