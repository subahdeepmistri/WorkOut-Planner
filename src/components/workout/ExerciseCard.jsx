import React from 'react';
import { Link as LinkIcon, Footprints, Timer, Trash2, Plus } from 'lucide-react';
import { SetRow } from './SetRow';

export const ExerciseCard = ({ exercise, index, onUpdateSet, onAddSet, onLink, previousBest, onRemove, onCardioMode, pendingSuperset, onUpdateName, disabled, onStartRest }) => {
    const isSuperset = exercise.supersetId !== null;
    const isWaiting = pendingSuperset === index;


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


    return (
        <div className={`rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 ${cardStyle}`}>
            <div className={`p-2 sm:p-3 border-b flex flex-wrap justify-between items-center gap-2 relative overflow-hidden ${headerStyle}`}>
                <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 min-w-[200px]">
                    <button onClick={(e) => { e.stopPropagation(); onLink(index); }} className={`p-3 -ml-2 rounded-full transition-colors ${isSuperset || isWaiting ? 'text-orange-500 hover:text-orange-400 bg-orange-500/10' : 'text-zinc-600 hover:text-orange-500 hover:bg-zinc-800'} disabled:opacity-50`} disabled={disabled}><LinkIcon size={18} /></button>
                    <div className="flex-1">
                        <div className={`font-bold flex items-center gap-2 ${nameColor}`}>
                            <input type="text" value={exercise.name} onChange={(e) => onUpdateName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-b border-transparent focus:border-zinc-500 outline-none w-full min-w-[120px] disabled:opacity-50" disabled={disabled} />
                        </div>
                        <div className={`text-[10px] uppercase tracking-wider mt-0.5 opacity-80 whitespace-nowrap`}>Target: {exercise.targetSets} Sets • {exercise.targetReps}</div>
                    </div>
                </div>
                {/* Actions Row: Stacks vertically on mobile (w-full), aligns right */}
                <div className="flex items-center gap-1 w-full justify-end sm:w-auto sm:gap-2 mt-0.5 sm:mt-0">
                    {exercise.type === 'cardio' && (
                        <div className="flex bg-zinc-950/50 rounded-lg p-0.5 border border-pink-500/30 mr-2">
                            <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'distance'); }} className={`p-3 rounded-md transition-all ${exercise.cardioMode === 'distance' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-500/50 hover:text-pink-400'} disabled:opacity-50`}><Footprints size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onCardioMode(index, 'circuit'); }} className={`p-3 rounded-md transition-all ${exercise.cardioMode === 'circuit' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-500/50 hover:text-pink-400'} disabled:opacity-50`}><Timer size={18} /></button>
                        </div>
                    )}
                    {exercise.type !== 'cardio' && exercise.type !== 'abs' && previousBest && (
                        <div className="text-right mr-3"><div className="text-[10px] text-zinc-500 uppercase">PB</div><div className="text-xs font-mono text-green-400 font-bold">{previousBest.weight}kg</div></div>
                    )}
                    <button onClick={() => onRemove(index)} className="p-3 text-zinc-600 hover:text-red-500 transition-colors disabled:opacity-50" disabled={disabled}><Trash2 size={20} /></button>
                </div>
            </div>
            <div className="px-2 py-2 sm:p-3">
                {exercise.type === 'cardio' ? (
                    <div className="mb-2 text-[10px] text-pink-500/70 uppercase tracking-widest text-center font-bold">{exercise.cardioMode === 'distance' ? 'Distance Tracking' : 'Circuit / Abs Tracking'}</div>
                ) : exercise.type === 'abs' ? (
                    <div className="mb-2 text-[10px] text-cyan-500/70 uppercase tracking-widest text-center font-bold">Core Training</div>
                ) : (
                    <div className="grid gap-3 mb-2 px-0" style={{ gridTemplateColumns: '24px minmax(50px, 0.8fr) minmax(60px, 1fr) minmax(60px, 1fr) 44px' }}>
                        <div className="text-[10px] text-green-500/50 font-bold text-center">#</div><div className="text-[10px] text-green-500/50 font-bold text-center">GOAL</div><div className="text-[10px] text-green-500/50 font-bold text-center">KG</div><div className="text-[10px] text-green-500/50 font-bold text-center">REPS</div><div className="text-[10px] text-green-500/50 font-bold text-center">✓</div>
                    </div>
                )}
                {exercise.sets.map((set, j) => (
                    <SetRow key={j} index={j} set={set} isCardio={exercise.type === 'cardio'} isAbs={exercise.type === 'abs'} cardioMode={exercise.cardioMode} onChange={(idx, field, val) => onUpdateSet(index, idx, field, val)} previousBest={previousBest} targetReps={exercise.targetReps} disabled={disabled} onRest={() => onStartRest(30)} />
                ))}
                <button onClick={(e) => { e.stopPropagation(); onAddSet(index); }} className={`w-full mt-4 py-3 text-sm font-medium rounded flex items-center justify-center gap-1 transition-colors border border-dashed text-zinc-500 border-zinc-700 hover:text-zinc-300 hover:bg-zinc-800/50 disabled:opacity-50`} disabled={disabled}><Plus size={16} /> Add Set</button>
            </div>
        </div>
    );
};
