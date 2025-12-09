import React from 'react';
import { Link as LinkIcon, Footprints, Timer, Trash2, Plus, Lock, Unlock } from 'lucide-react';
import { SetRow } from './SetRow';
import { AdherenceBar } from './AdherenceBar';
import { RestTimer } from './RestTimer';

export const ExerciseCard = ({ exercise, index, onUpdateSet, onAddSet, onRemoveSet, onLink, previousBest, onRemove, onCardioMode, pendingSuperset, onUpdateName, disabled, onStartRest, activeTimer, timerControls, onToggleLock }) => {
    const isSuperset = exercise.supersetId !== null;
    const isWaiting = pendingSuperset === index;
    const isCardLocked = exercise.isLocked;
    const isDisabled = disabled || isCardLocked;

    // Check if THIS card has the active timer
    const isTimerActive = activeTimer?.isActive && activeTimer?.activeContext === index;
    const { timeLeft } = activeTimer || {};
    const { onAdd, onStop } = timerControls || {};

    // ... (rest of hook logic remains same below)

    // --- Adherence Calculation ---
    // (Existing adherence logic...)
    const calculateAdherenceData = () => {
        let targetVol = 0;
        let actualVol = 0;
        let totalTargetReps = 0;
        let totalActualReps = 0;

        const tReps = exercise.numericalTargetReps || 8;
        const tSets = exercise.targetSets || 3;
        totalTargetReps = tSets * tReps;

        if (exercise.type === 'cardio') {
            targetVol = tSets * tReps;
            exercise.sets.forEach(s => {
                if (s.completed) {
                    let val = exercise.cardioMode === 'circuit' ? parseFloat(s.time) : parseFloat(s.distance);
                    if (isNaN(val) || val === 0) val = tReps;
                    actualVol += val;
                    totalActualReps += tReps;
                }
            });
        } else if (exercise.type === 'abs') {
            targetVol = tSets * tReps;
            exercise.sets.forEach(s => {
                if (s.completed) {
                    let val = (parseFloat(s.reps) || 0) + (parseFloat(s.holdTime) || 0);
                    if (val === 0) val = tReps;
                    actualVol += val;
                    totalActualReps += val;
                }
            });
        } else {
            // Strength: Calculate Volume Load (Reps * Weight)
            // Determine Reference Weight for Target
            let refWeight = previousBest?.weight || 0;

            // If no previous best, infer target weight from current inputs to create a dynamic goal
            if (!refWeight) {
                const validWeights = exercise.sets.map(s => parseFloat(s.weight)).filter(w => !isNaN(w) && w > 0);
                if (validWeights.length > 0) refWeight = Math.max(...validWeights);
            }

            // Fallback for Target Calculation
            const targetWeight = refWeight || 1;
            targetVol = tSets * tReps * targetWeight;

            exercise.sets.forEach(s => {
                if (s.completed) {
                    let r = parseFloat(s.reps);
                    if (isNaN(r) || r === 0) r = tReps;

                    let w = parseFloat(s.weight);
                    if (isNaN(w) || w === 0) w = 0; // If no weight, volume is 0? Or should we assume targetWeight? 
                    // Usually volume = 0 if weight is 0. 

                    const itemVol = r * w;
                    actualVol += itemVol;

                    totalActualReps += r;
                }
            });
        }

        let missedMessage = "";
        const completedSetsCount = exercise.sets.filter(s => s.completed).length;
        // Logic for missed message remains based on Reps roughly, or we can silence it for strength volume contexts if confusion arises
        // But for now, let's keep the existing rep-based missed msg logic or update it?
        // Old logic:
        const targetRepsForCompletedSets = completedSetsCount * tReps;
        const deficitReps = Math.round(targetRepsForCompletedSets - totalActualReps);
        if (deficitReps > 0) missedMessage = `Missed ~${deficitReps} reps`;

        return { targetVol, actualVol, missedMessage };
    };

    const { targetVol, actualVol, missedMessage } = calculateAdherenceData();


    // Theme Configuration
    const CARD_THEMES = {
        default: {
            card: "bg-zinc-50 dark:bg-green-900/10 border border-emerald-300 dark:border-green-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(34,197,94,0.1)]",
            header: "bg-emerald-200 dark:bg-green-900/20 border-b border-emerald-300 dark:border-green-500/20",
            name: "text-emerald-950 dark:text-green-100"
        },
        cardio: {
            card: "bg-zinc-50 dark:bg-pink-900/20 border border-pink-300 dark:border-pink-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(236,72,153,0.15)]",
            header: "bg-pink-200 dark:bg-pink-900/30 border-b border-pink-300 dark:border-pink-500/30",
            name: "text-pink-950 dark:text-pink-200"
        },
        abs: {
            card: "bg-zinc-50 dark:bg-cyan-900/20 border border-cyan-300 dark:border-cyan-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]",
            header: "bg-cyan-200 dark:bg-cyan-900/30 border-b border-cyan-300 dark:border-cyan-500/30",
            name: "text-cyan-950 dark:text-cyan-200"
        },
        superset: {
            card: "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-amber-500/10 dark:to-orange-500/10 border-2 border-orange-300 dark:border-orange-500/50 relative overflow-hidden shadow-md",
            header: "bg-orange-100/50 dark:bg-orange-500/10 border-b-2 border-orange-300 dark:border-orange-500/20",
            name: "text-zinc-900 dark:text-zinc-100"
        },
        waiting: {
            card: "bg-zinc-100 dark:bg-zinc-900/80 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-pulse",
            header: "bg-orange-100 dark:bg-orange-500/10 border-b-2 border-orange-300 dark:border-orange-500/30",
            name: "text-zinc-900 dark:text-zinc-100"
        }
    };

    const themeKey = isWaiting ? 'waiting' : isSuperset ? 'superset' : exercise.type || 'default';
    const theme = CARD_THEMES[themeKey] || CARD_THEMES.default;
    const { card: cardStyle, header: headerStyle, name: nameColor } = theme;


    // Use specific timer style for active header
    const finalHeaderStyle = isTimerActive ? "bg-emerald-950/90 border-emerald-500/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]" : headerStyle;

    return (
        <div className={`rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 ${cardStyle} ${isCardLocked ? 'opacity-80 grayscale-[0.3]' : ''}`}>
            <div className={`p-3 sm:p-3 border-b flex flex-wrap sm:flex-nowrap justify-between items-start sm:items-center gap-3 relative overflow-hidden transition-colors duration-500 ${finalHeaderStyle}`}>

                {isTimerActive ? (
                    /* --- TIMER HEADER MODE --- */
                    <RestTimer
                        timeLeft={timeLeft}
                        onAdd={onAdd}
                        onStop={onStop}
                    />
                ) : (
                    /* --- NORMAL HEADER MODE --- */
                    <>
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:flex-1 min-w-[200px]">
                            <button onClick={(e) => { e.stopPropagation(); onLink(index); }} className={`p-4 -ml-2 rounded-full transition-colors ${isSuperset || isWaiting ? 'text-orange-600 dark:text-orange-500 hover:text-orange-700 bg-orange-100 dark:bg-orange-500/10' : 'text-zinc-500 dark:text-zinc-600 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'} disabled:opacity-50 min-w-[48px] min-h-[48px] flex items-center justify-center`} disabled={disabled}><LinkIcon size={20} /></button>
                            <div className="flex-1">
                                <div className={`font-bold flex items-center gap-2 ${nameColor}`}>
                                    <input type="text" value={exercise.name} onChange={(e) => onUpdateName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-b border-transparent focus:border-zinc-500 outline-none w-full min-w-[120px] disabled:opacity-50 py-1" disabled={disabled} />
                                </div>
                                <div className={`text-[10px] uppercase tracking-wider mt-0.5 opacity-80 whitespace-nowrap`}>Target: {exercise.targetSets} Sets • {exercise.targetReps || '-'}</div>
                            </div>
                        </div>
                        {/* Actions Row: Stacks vertically on mobile (w-full), aligns right */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap">
                            {exercise.type === 'cardio' && (
                                <div className="flex bg-zinc-950/50 rounded-lg p-0.5 border border-pink-500/30 mr-auto sm:mr-2">
                                    <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'distance'); }} className={`p-4 rounded-md transition-all min-w-[48px] min-h-[48px] flex items-center justify-center ${exercise.cardioMode === 'distance' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-500/50 hover:text-pink-400'} disabled:opacity-50`}><Footprints size={20} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'circuit'); }} className={`p-4 rounded-md transition-all min-w-[48px] min-h-[48px] flex items-center justify-center ${exercise.cardioMode === 'circuit' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-500/50 hover:text-pink-400'} disabled:opacity-50`}><Timer size={20} /></button>
                                </div>
                            )}
                            {exercise.type !== 'cardio' && exercise.type !== 'abs' && previousBest && (
                                <div className="text-right mr-3 sm:ml-auto"><div className="text-[10px] text-zinc-500 uppercase">PB</div><div className="text-xs font-mono text-green-400 font-bold">{previousBest.weight}kg</div></div>
                            )}
                            <button onClick={() => onRemove(index)} className="p-4 text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 transition-colors disabled:opacity-50 min-w-[48px] min-h-[48px] flex items-center justify-center ml-auto sm:ml-0" disabled={isDisabled}><Trash2 size={20} /></button>
                            {/* Lock Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
                                className={`p-4 min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors rounded-full ${isCardLocked ? 'text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-500/10' : 'text-zinc-500 dark:text-zinc-600 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                                title={isCardLocked ? "Unlock Exercise" : "Lock Exercise"}
                            >
                                {isCardLocked ? <Lock size={20} /> : <Unlock size={20} />}
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="px-2 py-2 sm:p-3">
                {/* Ghost Bar Integration */}
                <div className="mb-4 px-1">
                    <AdherenceBar targetVolume={targetVol} actualVolume={actualVol} label={(exercise.type === 'cardio' || exercise.type === 'abs') ? "Volume Adherence" : `Volume: ${Math.round(actualVol).toLocaleString()} kg`} height="h-1.5" missedContext={missedMessage} />
                </div>

                {/* Header Row */}
                {exercise.type === 'cardio' ? (
                    exercise.cardioMode === 'distance' ? (
                        <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">#</div>
                            <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                                <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">DISTANCE</div><div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">TIME</div><div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">PACE</div>
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center w-[100px]">ACTIONS</div>
                        </div>
                    ) : (
                        <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">#</div>
                            <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                                <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">REPS</div><div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">DURATION</div>
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center w-[100px]">ACTIONS</div>
                        </div>
                    )
                ) : exercise.type === 'abs' ? (
                    <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                        <div className="text-[10px] text-zinc-500 dark:text-cyan-500/50 font-bold text-center">#</div>
                        <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                            <div className="text-[10px] text-zinc-500 dark:text-cyan-500/50 font-bold text-center">REPS / HOLD</div>
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-cyan-500/50 font-bold text-center w-[100px]">ACTIONS</div>
                    </div>
                ) : (
                    <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                        <div className="text-[10px] text-zinc-500 dark:text-green-500/50 font-bold text-center">#</div>
                        <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                            <div className="text-[10px] text-zinc-500 dark:text-green-500/50 font-bold text-center">GOAL</div><div className="text-[10px] text-zinc-500 dark:text-green-500/50 font-bold text-center">KG</div><div className="text-[10px] text-zinc-500 dark:text-green-500/50 font-bold text-center">REPS</div>
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-green-500/50 font-bold text-center w-[100px]">ACTIONS</div>
                    </div>
                )}
                {exercise.sets.map((set, j) => (
                    <SetRow key={j} index={j} set={set} isCardio={exercise.type === 'cardio'} isAbs={exercise.type === 'abs'} cardioMode={exercise.cardioMode} onChange={(idx, field, val) => onUpdateSet(index, idx, field, val)} onRemove={() => onRemoveSet(index, j)} previousBest={previousBest} targetReps={exercise.targetReps} disabled={isDisabled} onRest={() => onStartRest(30, index)} />
                ))}
                <button onClick={(e) => { e.stopPropagation(); onAddSet(index); }} className={`w-full mt-4 py-3 text-sm font-medium rounded flex items-center justify-center gap-1 transition-colors border border-dashed text-zinc-500 dark:text-zinc-500 border-zinc-400 dark:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 disabled:opacity-50`} disabled={isDisabled}><Plus size={16} /> Add Set</button>
            </div>
        </div>
    );
};
