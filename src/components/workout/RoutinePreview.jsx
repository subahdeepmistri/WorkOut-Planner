/**
 * RoutinePreview
 * Step 6: Preview the generated routine
 * Premium card design with collapsible sections
 */

import React, { useState } from 'react';
import { MUSCLE_GROUPS, EXPERIENCE_LEVELS } from '../../lib/fitnessConstants';

export function RoutinePreview({ routine, onRegenerate, onContinue }) {
    const [showWarmup, setShowWarmup] = useState(false);
    const [showCooldown, setShowCooldown] = useState(false);

    if (!routine) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-zinc-500">No routine generated yet</p>
            </div>
        );
    }

    const levelData = EXPERIENCE_LEVELS[routine.level];
    const levelColor = routine.level === 'beginner' ? 'text-emerald-400' :
        routine.level === 'moderate' ? 'text-amber-400' : 'text-red-400';

    return (
        <div className="w-full space-y-4 pb-24">
            {/* Routine Header Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-600/10 to-zinc-900/80 border border-emerald-500/30 p-5">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-3">
                        {routine.routineName}
                    </h3>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="text-base">⏱️</span>
                            <span className="font-medium">{routine.totalTime} min</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="text-base">📊</span>
                            <span className="font-medium">{routine.totalSets} sets</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="text-base">🏋️</span>
                            <span className="font-medium">{routine.totalExercises} exercises</span>
                        </div>
                    </div>

                    {/* Muscle icons and level */}
                    <div className="flex items-center gap-2">
                        {routine.muscleGroups.map(m => (
                            <span key={m} className="text-xl">{MUSCLE_GROUPS[m]?.icon}</span>
                        ))}
                        <span className={`text-sm font-semibold ${levelColor}`}>
                            {levelData?.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Warm-up Section */}
            {routine.warmup && (
                <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 overflow-hidden">
                    <button
                        onClick={() => setShowWarmup(!showWarmup)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <span className="text-xl">🔥</span>
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-white">Warm-up</span>
                                <span className="text-zinc-500 text-sm ml-2">{routine.warmup.duration} min</span>
                            </div>
                        </div>
                        <svg
                            className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${showWarmup ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showWarmup && (
                        <div className="px-4 pb-4 space-y-2">
                            {routine.warmup.exercises.map((ex, i) => (
                                <div key={i} className="flex justify-between text-sm py-2 border-t border-zinc-700/50">
                                    <span className="text-zinc-300">{ex.name}</span>
                                    <span className="text-zinc-500 font-medium">{ex.duration}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main Exercises */}
            <div className="space-y-3">
                <h4 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold px-1">
                    Main Workout
                </h4>

                {routine.exercises.map((exercise, index) => (
                    <div
                        key={exercise.id || index}
                        className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-400">
                                        {index + 1}
                                    </span>
                                    <h5 className="font-semibold text-white">{exercise.name}</h5>
                                </div>
                                {exercise.secondaryMuscle && (
                                    <p className="text-zinc-500 text-xs ml-8">
                                        {MUSCLE_GROUPS[exercise.primaryMuscle]?.name} → {MUSCLE_GROUPS[exercise.secondaryMuscle]?.name}
                                    </p>
                                )}
                            </div>

                            {/* Type badge */}
                            <span className={`
                px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide
                ${exercise.tag === 'COMPOUND'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-zinc-700 text-zinc-400'
                                }
              `}>
                                {exercise.tag}
                            </span>
                        </div>

                        {/* Sets, Reps, Rest */}
                        <div className="flex gap-4 text-sm ml-8">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700/50">
                                <span className="text-zinc-500">Sets:</span>
                                <span className="text-white font-semibold">{exercise.sets}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700/50">
                                <span className="text-zinc-500">Reps:</span>
                                <span className="text-white font-semibold">{exercise.reps}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700/50">
                                <span className="text-zinc-500">Rest:</span>
                                <span className="text-white font-semibold">{exercise.rest}s</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Finishers */}
            {routine.finishers && routine.finishers.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold px-1">
                        Finishers
                    </h4>

                    {routine.finishers.map((finisher, index) => (
                        <div
                            key={index}
                            className={`
                rounded-2xl p-4 border
                ${finisher.type === 'cardio'
                                    ? 'bg-gradient-to-r from-pink-500/10 to-pink-600/5 border-pink-500/30'
                                    : 'bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 border-cyan-500/30'
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${finisher.type === 'cardio' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
                                        }`}>
                                        <span className="text-xl">{finisher.type === 'cardio' ? '❤️‍🔥' : '🎯'}</span>
                                    </div>
                                    <span className="font-semibold text-white">{finisher.name}</span>
                                </div>
                                <span className={`text-sm font-medium ${finisher.type === 'cardio' ? 'text-pink-400' : 'text-cyan-400'
                                    }`}>
                                    {finisher.sets} × {finisher.reps}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cool-down Section */}
            {routine.cooldown && (
                <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 overflow-hidden">
                    <button
                        onClick={() => setShowCooldown(!showCooldown)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <span className="text-xl">❄️</span>
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-white">Cool-down</span>
                                <span className="text-zinc-500 text-sm ml-2">{routine.cooldown.duration} min</span>
                            </div>
                        </div>
                        <svg
                            className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${showCooldown ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showCooldown && (
                        <div className="px-4 pb-4 space-y-2">
                            {routine.cooldown.exercises.map((ex, i) => (
                                <div key={i} className="flex justify-between text-sm py-2 border-t border-zinc-700/50">
                                    <span className="text-zinc-300">{ex.name}</span>
                                    <span className="text-zinc-500 font-medium">{ex.duration}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Fixed Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-4 z-50">
                <div className="flex gap-3 max-w-md mx-auto">
                    <button
                        onClick={onRegenerate}
                        className="flex-1 py-3.5 rounded-xl font-semibold
                       bg-zinc-800 text-zinc-300 border border-zinc-700
                       hover:bg-zinc-700 active:scale-[0.98] transition-all
                       flex items-center justify-center gap-2"
                    >
                        <span>🔄</span>
                        Regenerate
                    </button>

                    <button
                        onClick={onContinue}
                        className="flex-1 py-3.5 rounded-xl font-bold
                       bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                       hover:from-emerald-500 hover:to-emerald-400
                       active:scale-[0.98] transition-all
                       flex items-center justify-center gap-2
                       shadow-lg shadow-emerald-500/25"
                    >
                        Looks Good ✓
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoutinePreview;
