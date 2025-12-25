import React, { useState } from 'react';
import { Link as LinkIcon, Footprints, Timer, Trash2, Plus, Lock, Unlock, Hash, Brain } from 'lucide-react';
import { SetRow } from './SetRow';
import { AdherenceBar } from './AdherenceBar';



export const ExerciseCard = ({ exercise, index, onUpdateSet, onAddSet, onRemoveSet, onLink, previousBest, onRemove, onCardioMode, onCoreMode, pendingSuperset, onUpdateName, disabled, onStartRest, activeTimer, timerControls, onToggleLock, isFocusMode, onStartSetTimer, isActiveExercise }) => {
    const isSuperset = exercise.supersetId !== null;
    const isWaiting = pendingSuperset === index;
    const isCardLocked = exercise.isLocked;
    const isDisabled = disabled || isCardLocked;
    const [isEditingName, setIsEditingName] = useState(false);
    // Check if THIS card has the active timer
    const isTimerActive = activeTimer?.isActive && activeTimer?.activeContext === index;
    const isGlobalTimerActive = activeTimer?.isActive;
    const { timeLeft } = activeTimer || {};
    const { onAdd, onStop } = timerControls || {};

    // Focus Logic: Focus if timer is HERE, or if NO timer is active and this is the active exercise
    const isFocused = isFocusMode && (isTimerActive || (!isGlobalTimerActive && isActiveExercise));

    // --- Adherence Calculation (V2: Sets Momentum) ---
    const calculateAdherenceData = () => {
        const totalSets = exercise.sets.length;

        if (exercise.type === 'cardio') {
            const isTimeMode = (exercise.cardioMode === 'circuit' || exercise.cardioMode === 'duration');
            const targetPerSet = parseFloat(exercise.numericalTargetReps) || 0;
            const targetTotal = (exercise.targetSets || 3) * targetPerSet; // Minutes or Km

            let currentTotal = 0;
            exercise.sets.forEach(s => {
                if (s.completed) {
                    if (isTimeMode) {
                        currentTotal += (parseFloat(s.time) || 0) / 60; // Seconds -> Minutes
                    } else {
                        currentTotal += (parseFloat(s.distance) || 0); // Km
                    }
                }
            });

            // If target is 0, default to showing sets count to prevent weird bars
            if (targetTotal === 0) {
                const completedSets = exercise.sets.filter(s => s.completed).length;
                return { targetVol: totalSets, actualVol: completedSets, unit: 'sets' };
            }

            return { targetVol: targetTotal, actualVol: currentTotal, unit: isTimeMode ? 'min' : 'km' };
        }

        const completedSets = exercise.sets.filter(s => s.completed).length;
        return { targetVol: totalSets, actualVol: completedSets, missedMessage: "" };
    };

    const adherenceData = calculateAdherenceData();
    const { targetVol, actualVol } = adherenceData;

    // --- PB / Record Logic ---
    const currentMaxWeight = exercise.sets.reduce((max, set) => {
        const weight = parseFloat(set.weight) || 0;
        return weight > max ? weight : max;
    }, 0);

    const isNewPB = previousBest && currentMaxWeight > parseFloat(previousBest.weight);


    // Theme Configuration
    const CARD_THEMES = {
        default: {
            card: "bg-white dark:bg-black/40 backdrop-blur-md border border-indigo-300 dark:border-indigo-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.1)]",
            header: "bg-indigo-100 dark:bg-indigo-900/20 border-b border-indigo-300 dark:border-indigo-500/20",
            name: "text-indigo-950 dark:text-indigo-100"
        },
        cardio: {
            card: "bg-white dark:bg-black/40 backdrop-blur-md border border-pink-300 dark:border-pink-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(236,72,153,0.15)]",
            header: "bg-pink-100 dark:bg-pink-900/30 border-b border-pink-300 dark:border-pink-500/30",
            name: "text-pink-950 dark:text-pink-200"
        },
        abs: {
            card: "bg-white dark:bg-black/40 backdrop-blur-md border border-emerald-300 dark:border-emerald-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
            header: "bg-emerald-100 dark:bg-emerald-900/30 border-b border-emerald-300 dark:border-emerald-500/30",
            name: "text-emerald-950 dark:text-emerald-200"
        },
        superset: {
            card: "bg-orange-50 dark:bg-black/40 backdrop-blur-md border-2 border-orange-300 dark:border-orange-500/50 relative overflow-hidden shadow-sm dark:shadow-[0_0_15px_rgba(249,115,22,0.15)]",
            header: "bg-orange-100/50 dark:bg-orange-900/20 border-b-2 border-orange-300 dark:border-orange-500/30",
            name: "text-zinc-900 dark:text-orange-100"
        },
        waiting: {
            card: "opacity-60 grayscale-[0.5] border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50",
            header: "bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800",
            name: "text-zinc-400 dark:text-zinc-500"
        }
    };

    const theme = isWaiting ? CARD_THEMES.waiting :
        isSuperset ? CARD_THEMES.superset :
            (exercise.type === 'cardio' ? CARD_THEMES.cardio : (exercise.type === 'abs' ? CARD_THEMES.abs : CARD_THEMES.default));
    const { card: cardStyle, header: headerStyle, name: nameColor } = theme;


    // Use specific timer style for active header
    const finalHeaderStyle = isTimerActive ? "bg-emerald-950/90 border-emerald-500/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]" : headerStyle;

    return (
        <div
            id={`exercise-${index}`}
            className={`relative rounded-3xl transition-all duration-500 ease-out group ${theme.card} ${isFocused ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-emerald-400 scale-[1.02] shadow-xl z-10' : ''} ${isFocusMode && !isFocused ? 'opacity-40 blur-[1px] scale-95 pointer-events-none grayscale-[0.5]' : ''}`}
        >

            {/* Header Section */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-3 rounded-t-[23px] transition-colors ${theme.header} cursor-pointer hover:bg-opacity-80`} onClick={() => onToggleLock && onToggleLock()}>
                {/* Left: Drag Handle & Name */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {isSuperset && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-sm">
                                    Superset {String.fromCharCode(65 + exercise.supersetId)}
                                </span>
                            )}
                            {isWaiting && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-zinc-300 text-zinc-600">
                                    Next Up
                                </span>
                            )}
                            {isEditingName && !isWaiting ? (
                                <input
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                    type="text"
                                    defaultValue={exercise.name}
                                    onBlur={(e) => {
                                        setIsEditingName(false);
                                        if (e.target.value.trim() !== "") {
                                            onUpdateName(index, e.target.value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.target.blur();
                                        }
                                    }}
                                    className={`text-lg sm:text-xl font-black italic tracking-tight bg-transparent outline-none border-b-2 border-current w-full min-w-[150px] ${theme.name}`}
                                />
                            ) : (
                                <h3
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isWaiting) setIsEditingName(true);
                                    }}
                                    className={`text-lg sm:text-xl font-black italic tracking-tight cursor-text hover:underline decoration-dashed decoration-2 underline-offset-4 ${theme.name}`}
                                >
                                    {isWaiting ? "???" : exercise.name}
                                </h3>
                            )}
                        </div>
                        {isWaiting && <p className="text-[10px] sm:text-xs font-medium text-zinc-400 mt-0.5">Complete current exercise to unlock</p>}

                        {!isWaiting && (
                            <div className="flex items-center gap-2 mt-0.5">
                                {/* AI Indicator (Active vs Dormant) */}
                                <div className="p-0.5" title={isNewPB ? `NEW PB! ${currentMaxWeight}kg (Beat ${previousBest.weight}kg)` : (previousBest ? `Beat your PB: ${previousBest.weight}kg` : "Insights appear after workouts")} onClick={(e) => e.stopPropagation()}>
                                    <Brain size={14} className={isNewPB ? "text-amber-500 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" : (previousBest ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700")} />
                                </div>

                                {exercise.type === 'cardio' ? (
                                    <div className="grid grid-cols-2 bg-pink-100 dark:bg-pink-900/40 rounded-full p-0.5 gap-0.5 w-[90px] sm:w-[110px]">
                                        <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'distance'); }} className={`py-0.5 rounded-full text-[9px] font-bold uppercase transition-all flex items-center justify-center ${exercise.cardioMode === 'distance' ? 'bg-white dark:bg-pink-500 text-pink-600 dark:text-white shadow-sm' : 'text-pink-400 dark:text-pink-300 hover:bg-white/50'}`}>Dist</button>
                                        <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'circuit'); }} className={`py-0.5 rounded-full text-[9px] font-bold uppercase transition-all flex items-center justify-center ${exercise.cardioMode === 'circuit' ? 'bg-white dark:bg-pink-500 text-pink-600 dark:text-white shadow-sm' : 'text-pink-400 dark:text-pink-300 hover:bg-white/50'}`}>Time</button>
                                    </div>
                                ) : exercise.type === 'abs' ? (
                                    <div className="grid grid-cols-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full p-0.5 gap-0.5 w-[90px] sm:w-[110px]">
                                        <button onClick={(e) => { e.stopPropagation(); onCoreMode(index, 'reps'); }} className={`py-0.5 rounded-full text-[9px] font-bold uppercase transition-all flex items-center justify-center ${exercise.coreMode === 'reps' ? 'bg-white dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-sm' : 'text-emerald-400 dark:text-emerald-300 hover:bg-white/50'}`}>Reps</button>
                                        <button onClick={(e) => { e.stopPropagation(); onCoreMode(index, 'hold'); }} className={`py-0.5 rounded-full text-[9px] font-bold uppercase transition-all flex items-center justify-center ${exercise.coreMode === 'hold' ? 'bg-white dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-sm' : 'text-emerald-400 dark:text-emerald-300 hover:bg-white/50'}`}>Hold</button>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-mono text-indigo-600/70 dark:text-indigo-400/70 bg-indigo-100/50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
                                        Target: {exercise.targetSets} × {exercise.numericalTargetReps}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Timer & Tools */}
                {!isWaiting && (
                    <>
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Link Button */}
                            {onLink && !isSuperset && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onLink(index, 'link'); }}
                                    className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-all"
                                    title="Link to next exercise (Superset)"
                                >
                                    <LinkIcon size={18} />
                                </button>
                            )}
                            {isSuperset && (
                                <div className="flex items-center">
                                    <button onClick={(e) => { e.stopPropagation(); onLink(index, 'unlink'); }} className="p-2 text-orange-500 bg-orange-100 dark:bg-orange-900/30 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all font-bold text-xs" title="Unlink Superset">
                                        Unlink
                                    </button>
                                </div>
                            )}
                            {exercise.type !== 'cardio' && exercise.type !== 'abs' && previousBest && (
                                <div className="text-right mr-3 sm:ml-auto"><div className="text-[10px] text-zinc-500 uppercase">PB</div><div className="text-xs font-mono text-green-400 font-bold">{previousBest.weight}kg</div></div>
                            )}
                            <button onClick={() => onRemove(index)} className="p-2 text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500 transition-colors disabled:opacity-50 rounded-full" disabled={isDisabled}><Trash2 size={18} /></button>
                            {/* Lock Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
                                className={`p-2 flex items-center justify-center transition-colors rounded-full ${isCardLocked ? 'text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-500/10' : 'text-zinc-500 dark:text-zinc-600 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'} `}
                                title={isCardLocked ? "Unlock Exercise" : "Lock Exercise"}
                            >
                                {isCardLocked ? <Lock size={18} /> : <Unlock size={18} />}
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="px-2 py-2 sm:p-3">
                {/* Sets Momentum Bar */}
                <div className="mb-4 px-1">
                    <AdherenceBar
                        targetVolume={targetVol}
                        actualVolume={actualVol}
                        label={(() => {
                            if (exercise.type === 'cardio' && adherenceData.unit) {
                                return `${Math.round(actualVol * 10) / 10} / ${targetVol} ${adherenceData.unit === 'min' ? 'Minutes' : 'Km'}`;
                            }
                            return `${actualVol} / ${targetVol} Sets Completed`;
                        })()}
                        height="h-2"
                        category={exercise.type === 'cardio' ? 'cardio' : (exercise.type === 'abs' ? 'default' : 'strength')}
                    />
                </div>

                {/* Header Row */}
                {exercise.type === 'cardio' ? (
                    exercise.cardioMode === 'distance' ? (
                        <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">#</div>
                            <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                                <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">DISTANCE</div><div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">TIME</div><div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">PACE</div>
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center w-[70px] sm:w-[100px]">ACTIONS</div>
                        </div>
                    ) : (
                        <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">#</div>
                            <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                                <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center">DURATION</div>
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-pink-500/50 font-bold text-center w-[70px] sm:w-[100px]">ACTIONS</div>
                        </div>
                    )
                ) : exercise.type === 'abs' ? (
                    <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                        <div className="text-[10px] text-zinc-500 dark:text-emerald-500/50 font-bold text-center">#</div>
                        <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                            <div className="text-[10px] text-zinc-500 dark:text-emerald-500/50 font-bold text-center">{(exercise.coreMode === 'hold') ? 'HOLD TIME' : 'REPS'}</div>
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-emerald-500/50 font-bold text-center w-[70px] sm:w-[100px]">ACTIONS</div>
                    </div>
                ) : (
                    <div className="grid gap-2 mb-2 px-0 items-center grid-cols-[24px_1fr_auto]">
                        <div className="text-[10px] text-zinc-500 dark:text-indigo-500/50 font-bold text-center">#</div>
                        <div className="grid gap-2 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
                            <div className="text-[10px] text-zinc-500 dark:text-indigo-500/50 font-bold text-center">GOAL</div><div className="text-[10px] text-zinc-500 dark:text-indigo-500/50 font-bold text-center">KG</div><div className="text-[10px] text-zinc-500 dark:text-indigo-500/50 font-bold text-center">REPS</div>
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-indigo-500/50 font-bold text-center w-[70px] sm:w-[100px]">ACTIONS</div>
                    </div>
                )}
                {(() => {
                    const activeSetIndex = exercise.sets.findIndex(s => !s.completed);
                    return exercise.sets.map((set, j) => (
                        <SetRow
                            key={j}
                            index={j}
                            set={set}
                            isCardio={exercise.type === 'cardio'}
                            isAbs={exercise.type === 'abs'}
                            cardioMode={exercise.cardioMode}
                            coreMode={exercise.coreMode}
                            onChange={(idx, field, val) => onUpdateSet(index, idx, field, val)}
                            onRemove={() => onRemoveSet(index, j)}
                            previousBest={previousBest}
                            targetReps={exercise.targetReps}
                            disabled={isDisabled}

                            isFocusMode={isFocusMode}
                            onStartTimer={(duration) => onStartSetTimer && onStartSetTimer(duration, j)}
                            previousSet={j > 0 ? exercise.sets[j - 1] : null}
                            isActiveSet={j === activeSetIndex}
                            exercise={exercise}
                        />
                    ));
                })()}
                {!isFocusMode && (
                    <button onClick={(e) => { e.stopPropagation(); onAddSet(index); }} className={`w-full mt-4 py-3 text-sm font-medium rounded flex items-center justify-center gap-1 transition-colors border border-dashed text-zinc-500 dark:text-zinc-500 border-zinc-400 dark:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 disabled:opacity-50`} disabled={isDisabled}><Plus size={16} /> Add Set</button>
                )}
            </div>
        </div>
    );
};
