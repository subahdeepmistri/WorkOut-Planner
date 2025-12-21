import React, { useEffect } from 'react';
import { CheckCircle, X, Calculator, Plus, Play } from 'lucide-react';
import { parseTargetReps } from '../../utils/helpers';
import { QuickChips } from './QuickChips';
import { useAiCoach } from '../../hooks/useAiCoach';

export const SetRow = ({ set, index, onChange, onRemove, previousBest, targetReps, isCardio, cardioMode, coreMode, isAbs, disabled, onRest, isFocusMode, onStartTimer, previousSet, isActiveSet, exercise }) => {
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

    // Auto-Calculate Pace for Cardio
    useEffect(() => {
        if (isCardio && cardioMode === 'distance') {
            const d = parseFloat(set.distance);
            const t = parseFloat(set.time);
            if (d > 0 && t > 0) {
                const paceVal = (t / d).toFixed(2);
                if (set.pace !== paceVal) {
                    onChange(index, 'pace', paceVal);
                }
            } else if (set.pace !== '') {
                // Clear pace if inputs invalid
                onChange(index, 'pace', '');
            }
        }
    }, [set.distance, set.time, isCardio, cardioMode, index, onChange, set.pace]);


    // Validation Logic
    const validateAndComplete = () => {
        if (set.completed) {
            // Uncheck is always allowed
            onChange(index, 'completed', false);
            return;
        }

        // Check Validity
        let isValid = false;
        if (isCardio) {
            if (cardioMode === 'distance') {
                isValid = parseFloat(set.distance) > 0 && parseFloat(set.time) > 0;
            } else {
                isValid = (set.time && parseFloat(set.time) > 0) || (set.duration && set.duration.length > 0);
            }
        } else if (isAbs) {
            if (coreMode === 'hold') {
                isValid = (set.holdTime && set.holdTime.length > 0);
            } else {
                isValid = parseFloat(set.reps) > 0;
            }
        } else {
            isValid = parseFloat(set.reps) > 0 && parseFloat(set.weight) >= 0;
        }

        if (isValid) {
            onChange(index, 'completed', true);
            if (onRest) onRest();
        }
    };

    // Helper for safe numeric input change
    const handleNumChange = (field, value) => {
        if (value === '') {
            onChange(index, field, value);
            return;
        }
        const num = parseFloat(value);
        if (!isNaN(num) && num >= 0) {
            onChange(index, field, value);
        }
    };

    // Quick Add Helpers
    const adjustValue = (field, amount) => {
        if (disabled) return;
        const val = set[field];

        // Special Handling for Core Hold Time (Force mm:ss)
        if (isAbs && coreMode === 'hold' && field === 'holdTime') {
            let currentSeconds = 0;
            if (typeof val === 'string' && val.includes(':')) {
                const parts = val.split(':');
                currentSeconds = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
            } else {
                currentSeconds = parseFloat(val) || 0;
            }

            const newSeconds = Math.max(0, currentSeconds + amount);
            const m = Math.floor(newSeconds / 60);
            const s = newSeconds % 60;
            onChange(index, field, `${m}:${s.toString().padStart(2, '0')}`);
            return;
        }

        // Generic Logic for others
        // Handle mm:ss if it already exists (e.g. maybe future timed sets)
        if (typeof val === 'string' && val.includes(':')) {
            const parts = val.split(':');
            const currentSeconds = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
            const newSeconds = Math.max(0, currentSeconds + amount);

            const m = Math.floor(newSeconds / 60);
            const s = newSeconds % 60;
            onChange(index, field, `${m}:${s.toString().padStart(2, '0')}`);
            return;
        }

        const current = parseFloat(val) || 0;
        const newVal = Math.max(0, current + amount);
        onChange(index, field, String(newVal));
    }

    const handleCopy = () => {
        if (!previousSet || disabled) return;
        if (isCardio) {
            if (previousSet.distance) onChange(index, 'distance', previousSet.distance);
            if (previousSet.time) onChange(index, 'time', previousSet.time);
        } else if (isAbs) {
            if (previousSet.holdTime) onChange(index, 'holdTime', previousSet.holdTime);
            if (previousSet.reps) onChange(index, 'reps', previousSet.reps);
        } else {
            // Strength
            if (previousSet.weight) onChange(index, 'weight', previousSet.weight);
            if (previousSet.reps) onChange(index, 'reps', previousSet.reps);
            if (previousSet.target) onChange(index, 'target', previousSet.target);
        }
    }

    // Helper for Timer Start
    const handleStartTimer = () => {
        let duration = 0;
        // Parse time: "mm:ss" or number
        const parseTime = (val) => {
            if (!val) return 0;
            if (typeof val === 'number') return val * 60;
            if (val.toString().includes(':')) {
                const parts = val.split(':');
                const m = parseInt(parts[0]) || 0;
                const s = parseInt(parts[1]) || 0;
                return (m * 60) + s;
            }
            return parseFloat(val) * 60;
        };

        if (isCardio && cardioMode === 'circuit') {
            duration = parseTime(set.time);
        } else if (isAbs && coreMode === 'hold') {
            if (!set.holdTime.includes(':')) {
                duration = parseFloat(set.holdTime); // Seconds for hold if pure number
            } else {
                duration = parseTime(set.holdTime);
            }
        }

        if (duration > 0 && onStartTimer) {
            onStartTimer(duration);
        }
    };

    // AI Suggestions
    const suggestions = useAiCoach(exercise, index);

    const handleAiAction = (suggestion) => {
        const { action, field, value, payload } = suggestion;
        if (action === 'COPY') {
            handleCopy();
        } else if (action === 'ADJUST') {
            adjustValue(field, value);
        } else if (action === 'ADJUST_TIME') {
            // Specific handler for mm:ss or seconds
            adjustValue(field, value); // Fallback to numeric add for now, assuming seconds input
        } else if (action === 'MATCH_PACE') {
            if (payload.distance) onChange(index, 'distance', payload.distance);
            if (payload.time) onChange(index, 'time', payload.time);
        }
    };

    let focusClass = '';
    if (isFocusMode) {
        if (set.completed) {
            focusClass = 'opacity-30 blur-[0.5px] pointer-events-none grayscale';
        } else if (isActiveSet) {
            focusClass = 'scale-[1.02] bg-white dark:bg-zinc-900 shadow-xl z-20 border-l-4 border-emerald-500 my-2 rounded-xl ring-2 ring-emerald-500/20';
        }
    }

    // Determine type for QuickChips
    let chipType = 'strength';
    let chipMode = null;
    if (isCardio) {
        chipType = 'cardio';
        chipMode = cardioMode;
    } else if (isAbs) {
        chipType = 'abs';
        chipMode = coreMode;
    }

    if (isCardio) {
        const isDistance = cardioMode === 'distance';
        return (
            <div className={`py-3 border-b border-pink-200 dark:border-pink-900/10 last:border-0 relative hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 ${focusClass}`}>
                {isDistance ? (
                    <div className="grid gap-2 items-center grid-cols-[24px_1fr_auto]">
                        <span className="text-pink-600/70 text-sm font-mono text-center">{index + 1}</span>
                        <div className="flex flex-col w-full">
                            <div className="grid gap-2 w-full grid-cols-3">
                                {/* Distance */}
                                <div className="relative group">
                                    <input type="number" min="0" step="0.1" disabled={disabled} value={set.distance || ''} onChange={(e) => handleNumChange('distance', e.target.value)} placeholder="km" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 font-bold rounded-t-md transition-colors" />
                                </div>
                                {/* Time */}
                                <div className="relative group">
                                    <input type="number" min="0" disabled={disabled} value={set.time || ''} onChange={(e) => handleNumChange('time', e.target.value)} placeholder="min" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 font-bold rounded-t-md transition-colors" />
                                </div>
                                {/* Pace (Read Only) */}
                                <div className="relative">
                                    <input type="text" readOnly disabled value={set.pace || ''} placeholder="-" className="w-full bg-zinc-100 dark:bg-zinc-950/30 border-b border-transparent px-1 py-3 text-center font-mono text-zinc-500 dark:text-zinc-500 outline-none text-xs font-bold rounded-t-md" />
                                </div>
                            </div>
                            {/* Chips (Horizontal Scroll) */}
                            {!set.completed && isActiveSet && !disabled && (
                                <div className="mt-2 w-full overflow-x-auto pb-1 scrollbar-hide">
                                    <QuickChips type="cardio" mode="distance" subset={['distance', 'time', 'ai']} onAdjust={adjustValue} suggestions={suggestions} onSuggestion={handleAiAction} className="flex-nowrap" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-1 justify-center items-center h-full">
                            <button disabled={disabled} onClick={validateAndComplete} title={set.completed ? "Mark Incomplete" : "Mark Complete"} className={`w-9 h-9 p-1.5 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                            {!isFocusMode && <button disabled={disabled} onClick={() => onRemove()} title="Delete Set" className="w-9 h-9 flex items-center justify-center transition-colors bg-transparent text-zinc-600 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 active:scale-95"><X size={18} /></button>}
                        </div>
                    </div>
                ) : (
                    /* Cardio: Circuit / Duration Only */
                    <div className="grid gap-2 items-center grid-cols-[24px_1fr_auto]">
                        <span className="text-pink-600/70 text-sm font-mono text-center">{index + 1}</span>
                        <div className="flex flex-col w-full">
                            <div className="grid gap-2 w-full grid-cols-1">
                                <div className="relative group flex items-center">
                                    <input type="text" disabled={disabled} value={set.time || ''} onChange={(e) => onChange(index, 'time', e.target.value)} placeholder="Duration (min)" className="w-full bg-pink-50/50 dark:bg-zinc-900/50 border-b border-pink-200 dark:border-pink-900/30 focus:border-pink-500 px-1 py-3 text-center font-mono text-pink-900 dark:text-pink-100 outline-none disabled:opacity-50 text-sm placeholder:text-pink-700/50 dark:placeholder:text-zinc-600 rounded-t-md transition-colors font-bold" />
                                    {onStartTimer && !set.completed && <button onClick={handleStartTimer} className="absolute left-0 top-0 h-full px-2 text-pink-400 hover:text-pink-600 active:scale-90 transition-all z-10"><Play size={14} fill="currentColor" /></button>}
                                    {!disabled && <button onClick={() => adjustValue('time', 5)} className="absolute right-0 top-0 h-full px-2 text-pink-300 hover:text-pink-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100"><Plus size={14} /></button>}
                                </div>
                            </div>
                            {/* Chips */}
                            {!set.completed && isActiveSet && !disabled && (
                                <div className="mt-1.5 w-full">
                                    <QuickChips type="cardio" mode="circuit" onAdjust={adjustValue} suggestions={suggestions} onSuggestion={handleAiAction} className="mt-0 ml-0" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-1 justify-center items-center">
                            <button disabled={disabled} onClick={validateAndComplete} className={`w-9 h-9 p-1.5 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                            {!isFocusMode && <button disabled={disabled} onClick={() => onRemove()} className="w-9 h-9 flex items-center justify-center transition-colors bg-transparent text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 active:scale-95"><X size={18} /></button>}
                        </div>
                    </div>
                )
                }
            </div >
        );
    }

    if (isAbs) {
        return (
            <div className={`py-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 rounded-lg ${focusClass}`}>
                <div className="py-2">
                    <div className="grid gap-3 items-center grid-cols-[24px_1fr_auto]">
                        <span className="text-emerald-600/70 text-sm font-mono text-center">{index + 1}</span>
                        <div className="flex flex-col w-full">
                            {/* Dynamic Input based on Core Mode */}
                            <div className="relative w-full group">
                                {coreMode === 'hold' ? (
                                    <div className="relative flex items-center">
                                        <input type="text" disabled={disabled} value={set.holdTime || ''} onChange={(e) => onChange(index, 'holdTime', e.target.value)} placeholder="mm:ss" className="w-full bg-emerald-50/50 dark:bg-zinc-900/50 border-b border-emerald-200 dark:border-emerald-900/50 focus:border-emerald-500 px-2 py-3 text-center font-mono text-emerald-900 dark:text-emerald-100 outline-none placeholder:text-emerald-700/50 dark:placeholder:text-zinc-700 disabled:opacity-50 font-bold rounded-t-md transition-colors" />
                                        {onStartTimer && !set.completed && <button onClick={handleStartTimer} className="absolute left-0 top-0 h-full px-2 text-emerald-500 hover:text-emerald-700 active:scale-90 transition-all z-10"><Play size={14} fill="currentColor" /></button>}
                                    </div>
                                ) : (
                                    <>
                                        <input type="number" min="0" disabled={disabled} value={set.reps || ''} onChange={(e) => handleNumChange('reps', e.target.value)} placeholder="0" className="w-full bg-emerald-50/50 dark:bg-zinc-900/50 border-b border-emerald-200 dark:border-emerald-900/50 focus:border-emerald-500 px-2 py-3 text-center font-mono text-emerald-900 dark:text-emerald-100 outline-none placeholder:text-emerald-700/50 dark:placeholder:text-zinc-700 disabled:opacity-50 font-bold rounded-t-md transition-colors" />
                                        {!disabled && <button onClick={() => adjustValue('reps', 5)} className="absolute right-0 top-0 h-full px-2 text-emerald-300 hover:text-emerald-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100"><Plus size={14} /></button>}
                                    </>
                                )}
                            </div>
                            {/* Chips (Horizontal Scroll) */}
                            {!set.completed && isActiveSet && !disabled && (
                                <div className="mt-2 w-full overflow-x-auto pb-1 scrollbar-hide">
                                    <QuickChips type="abs" mode={coreMode} onAdjust={adjustValue} onCopy={handleCopy} canCopy={!!previousSet} suggestions={suggestions} onSuggestion={handleAiAction} className="flex-nowrap" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-1 justify-center items-center">
                            <button disabled={disabled} onClick={validateAndComplete} className={`w-9 h-9 p-1.5 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700'} disabled:opacity-50 border border-zinc-300 dark:border-zinc-700`}><CheckCircle size={18} /></button>
                            {!isFocusMode && <button disabled={disabled} onClick={() => onRemove()} className="w-9 h-9 flex items-center justify-center transition-colors text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 active:scale-95"><X size={18} /></button>}
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    const defaultTarget = parseTargetReps(targetReps) || 0;
    const rowTarget = set.target !== undefined ? set.target : defaultTarget;

    return (
        <div className={`py-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 rounded-lg ${focusClass}`}>
            <div className="grid gap-2 items-center grid-cols-[24px_1fr_auto]">
                <span className="text-zinc-600 text-sm font-mono text-center">{index + 1}</span>

                <div className="flex flex-col w-full">
                    <div className="grid gap-2 w-full grid-cols-3">
                        <div className="relative"><input type="number" min="0" disabled={disabled} value={set.target !== undefined ? set.target : (defaultTarget || '')} onChange={(e) => handleNumChange('target', e.target.value)} placeholder={defaultTarget || '-'} className="w-full bg-indigo-50/50 dark:bg-zinc-900/50 border-b border-indigo-200 dark:border-indigo-900/30 text-indigo-900 dark:text-indigo-500/70 focus:border-indigo-500 px-1 py-3 text-center font-mono outline-none disabled:opacity-50 font-bold rounded-t-md transition-colors placeholder:text-indigo-700/50 dark:placeholder:text-indigo-500/30" /></div>

                        <div className="relative"><input type="number" min="0" disabled={disabled} value={set.weight || ''} onChange={(e) => handleNumChange('weight', e.target.value)} placeholder="kg" className="w-full bg-indigo-50/50 dark:bg-zinc-900/50 border-b border-indigo-200 dark:border-indigo-900/30 focus:border-indigo-500 px-2 py-3 text-center font-mono text-indigo-900 dark:text-indigo-100 outline-none disabled:opacity-50 font-bold rounded-t-md transition-colors placeholder:text-indigo-700/50 dark:placeholder:text-indigo-500/30" />{previousBest && (<div className="absolute -top-5 left-0 w-full text-center text-[10px] text-green-600/70 dark:text-green-500/50">Best: {previousBest.weight}kg</div>)}</div>

                        <div className="relative group">
                            <input type="number" min="0" disabled={disabled} value={set.reps || ''} onChange={(e) => handleNumChange('reps', e.target.value)} placeholder="-" className="w-full bg-indigo-50/50 dark:bg-zinc-900/50 border-b border-indigo-200 dark:border-indigo-900/30 focus:border-indigo-500 px-2 py-3 text-center font-mono text-indigo-900 dark:text-indigo-100 outline-none disabled:opacity-50 font-bold rounded-t-md transition-colors placeholder:text-indigo-700/50 dark:placeholder:text-indigo-500/30" />
                            {!disabled && <button onClick={() => adjustValue('reps', 1)} className="absolute right-0 top-0 h-full px-2 text-indigo-300 hover:text-indigo-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100"><Plus size={14} /></button>}
                        </div>
                    </div>
                    {/* Chips (Horizontal Scroll) */}
                    {!set.completed && isActiveSet && !disabled && (
                        <div className="mt-2 w-full overflow-x-auto pb-1 scrollbar-hide">
                            <QuickChips type="strength" subset={['copy']} onAdjust={adjustValue} onCopy={handleCopy} canCopy={!!previousSet} suggestions={suggestions} onSuggestion={handleAiAction} className="flex-nowrap" />
                        </div>
                    )}
                </div>

                <div className="flex gap-1 justify-center items-center">
                    <button disabled={disabled} onClick={validateAndComplete} className={`w-9 h-9 p-1.5 rounded flex items-center justify-center transition-colors mb-0 ${set.completed ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'} disabled:opacity-50`}><CheckCircle size={18} /></button>
                    {!isFocusMode && <button disabled={disabled} onClick={() => onRemove()} className="w-9 h-9 flex items-center justify-center transition-colors text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 active:scale-95"><X size={18} /></button>}
                </div>
            </div>

            <div className="flex px-1 mt-1">
                <div className="w-[24px] mr-2"></div><div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-200 dark:border-transparent"><div className={`h-full rounded-sm transition-all duration-300 ease-out ${barColor} ${glowClass}`} style={{ width: `${Math.min((reps / (rowTarget || 1)) * 100, 100)}%` }} /></div><div className="w-[110px] ml-2"></div>
            </div>
        </div >
    );
};
