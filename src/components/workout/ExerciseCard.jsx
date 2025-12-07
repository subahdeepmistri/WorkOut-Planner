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
            targetVol = tSets * tReps;
            exercise.sets.forEach(s => {
                if (s.completed) {
                    let r = parseFloat(s.reps);
                    if (isNaN(r) || r === 0) r = tReps;
                    actualVol += r;
                    totalActualReps += r;
                }
            });
        }

        let missedMessage = "";
        const completedSetsCount = exercise.sets.filter(s => s.completed).length;
        const targetRepsForCompletedSets = completedSetsCount * tReps;
        const deficitReps = Math.round(targetRepsForCompletedSets - totalActualReps);
        if (deficitReps > 0) missedMessage = `Missed ~${deficitReps} reps`;

        return { targetVol, actualVol, missedMessage };
    };

    const { targetVol, actualVol, missedMessage } = calculateAdherenceData();


    // Theme Configuration
    const CARD_THEMES = {
        default: {
            card: "bg-green-900/10 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
            header: "bg-green-900/20 border-green-500/20",
            name: "text-green-100"
        },
        cardio: {
            card: "bg-pink-900/20 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
            header: "bg-pink-900/30 border-pink-500/30",
            name: "text-pink-200"
        },
        abs: {
            card: "bg-cyan-900/20 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]",
            header: "bg-cyan-900/30 border-cyan-500/30",
            name: "text-cyan-200"
        },
        superset: {
            card: "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-500/50 relative overflow-hidden",
            header: "bg-orange-500/10 border-orange-500/20",
            name: "text-zinc-100"
        },
        waiting: {
            card: "bg-zinc-900/80 border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-pulse",
            header: "bg-orange-500/10 border-orange-500/30",
            name: "text-zinc-100"
        }
    };

    const themeKey = isWaiting ? 'waiting' : isSuperset ? 'superset' : exercise.type || 'default';
    const theme = CARD_THEMES[themeKey] || CARD_THEMES.default;
    const { card: cardStyle, header: headerStyle, name: nameColor } = theme;


    // Use specific timer style for active header
    const finalHeaderStyle = isTimerActive ? "bg-emerald-950/90 border-emerald-500/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]" : headerStyle;

    return (
        <div className={`rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 ${cardStyle} ${isCardLocked ? 'opacity-80 grayscale-[0.3]' : ''}`}>
            <div className={`p-3 sm:p-3 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden transition-colors duration-500 ${finalHeaderStyle}`}>

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
                        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 min-w-[200px]">
                            <button onClick={(e) => { e.stopPropagation(); onLink(index); }} className={`p-3 -ml-2 rounded-full transition-colors ${isSuperset || isWaiting ? 'text-orange-500 hover:text-orange-400 bg-orange-500/10' : 'text-zinc-600 hover:text-orange-500 hover:bg-zinc-800'} disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center`} disabled={disabled}><LinkIcon size={20} /></button>
                            <div className="flex-1">
                                <div className={`font-bold flex items-center gap-2 ${nameColor}`}>
                                    <input type="text" value={exercise.name} onChange={(e) => onUpdateName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-b border-transparent focus:border-zinc-500 outline-none w-full min-w-[120px] disabled:opacity-50 py-1" disabled={disabled} />
                                </div>
                                <div className={`text-[10px] uppercase tracking-wider mt-0.5 opacity-80 whitespace-nowrap`}>Target: {exercise.targetSets} Sets • {exercise.targetReps || '-'}</div>
                            </div>
                        </div>
                        {/* Actions Row: Stacks vertically on mobile (w-full), aligns right */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                            {exercise.type === 'cardio' && (
                                <div className="flex bg-zinc-950/50 rounded-lg p-0.5 border border-pink-500/30 mr-auto sm:mr-2">
                                    <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'distance'); }} className={`p-3 rounded-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${exercise.cardioMode === 'distance' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-500/50 hover:text-pink-400'} disabled:opacity-50`}><Footprints size={20} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'circuit'); }} className={`p-3 rounded-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${exercise.cardioMode === 'circuit' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-500/50 hover:text-pink-400'} disabled:opacity-50`}><Timer size={20} /></button>
                                </div>
                            )}
                            {exercise.type !== 'cardio' && exercise.type !== 'abs' && previousBest && (
                                <div className="text-right mr-3 sm:ml-auto"><div className="text-[10px] text-zinc-500 uppercase">PB</div><div className="text-xs font-mono text-green-400 font-bold">{previousBest.weight}kg</div></div>
                            )}
                            <button onClick={() => onRemove(index)} className="p-3 text-zinc-600 hover:text-red-500 transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center ml-auto sm:ml-0" disabled={isDisabled}><Trash2 size={20} /></button>
                            {/* Lock Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
                                className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors rounded-full ${isCardLocked ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-600 hover:text-amber-500 hover:bg-zinc-800'}`}
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
                    <AdherenceBar targetVolume={targetVol} actualVolume={actualVol} label="Volume Adherence" height="h-1.5" missedContext={missedMessage} />
                </div>

                {/* Header Row */}
                {exercise.type === 'cardio' ? (
                    exercise.cardioMode === 'distance' ? (
                        <div className="grid gap-2 mb-2 px-0 items-center" style={{ gridTemplateColumns: '24px 1fr 1fr 1fr 110px' }}>
                            <div className="text-[10px] text-pink-500/50 font-bold text-center">#</div><div className="text-[10px] text-pink-500/50 font-bold text-center">DISTANCE</div><div className="text-[10px] text-pink-500/50 font-bold text-center">TIME</div><div className="text-[10px] text-pink-500/50 font-bold text-center">PACE</div><div className="text-[10px] text-pink-500/50 font-bold text-center">ACTIONS</div>
                        </div>
                    ) : (
                        <div className="grid gap-2 mb-2 px-0 items-center" style={{ gridTemplateColumns: '24px 1fr 1fr 110px' }}>
                            <div className="text-[10px] text-pink-500/50 font-bold text-center">#</div><div className="text-[10px] text-pink-500/50 font-bold text-center">REPS</div><div className="text-[10px] text-pink-500/50 font-bold text-center">DURATION</div><div className="text-[10px] text-pink-500/50 font-bold text-center">ACTIONS</div>
                        </div>
                    )
                ) : exercise.type === 'abs' ? (
                    <div className="grid gap-2 mb-2 px-0 items-center" style={{ gridTemplateColumns: '24px 1fr 110px' }}>
                        <div className="text-[10px] text-cyan-500/50 font-bold text-center">#</div><div className="text-[10px] text-cyan-500/50 font-bold text-center">REPS / HOLD</div><div className="text-[10px] text-cyan-500/50 font-bold text-center">ACTIONS</div>
                    </div>
                ) : (
                    <div className="grid gap-2 mb-2 px-0 items-center" style={{ gridTemplateColumns: '24px minmax(50px, 0.6fr) minmax(60px, 1fr) minmax(60px, 1fr) 110px' }}>
                        <div className="text-[10px] text-green-500/50 font-bold text-center">#</div><div className="text-[10px] text-green-500/50 font-bold text-center">GOAL</div><div className="text-[10px] text-green-500/50 font-bold text-center">KG</div><div className="text-[10px] text-green-500/50 font-bold text-center">REPS</div><div className="text-[10px] text-green-500/50 font-bold text-center">ACTIONS</div>
                    </div>
                )}
                {exercise.sets.map((set, j) => (
                    <SetRow key={j} index={j} set={set} isCardio={exercise.type === 'cardio'} isAbs={exercise.type === 'abs'} cardioMode={exercise.cardioMode} onChange={(idx, field, val) => onUpdateSet(index, idx, field, val)} onRemove={() => onRemoveSet(index, j)} previousBest={previousBest} targetReps={exercise.targetReps} disabled={isDisabled} onRest={() => onStartRest(30, index)} />
                ))}
                <button onClick={(e) => { e.stopPropagation(); onAddSet(index); }} className={`w-full mt-4 py-3 text-sm font-medium rounded flex items-center justify-center gap-1 transition-colors border border-dashed text-zinc-500 border-zinc-700 hover:text-zinc-300 hover:bg-zinc-800/50 disabled:opacity-50`} disabled={isDisabled}><Plus size={16} /> Add Set</button>
            </div>
        </div>
    );
};
