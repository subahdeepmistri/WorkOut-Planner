/**
 * SaveRoutineScreen
 * Step 7: Name and save the routine
 * Premium input design with glassmorphic summary cards
 */

import React, { useState, useMemo } from 'react';
import { MUSCLE_GROUPS } from '../../lib/fitnessConstants';

export function SaveRoutineScreen({ routine, onSave, onStartNow, onCancel }) {
    const [routineName, setRoutineName] = useState(routine?.routineName || 'My Custom Routine');
    const [isSaving, setIsSaving] = useState(false);

    const isValidName = useMemo(() => {
        return routineName.trim().length >= 2 && routineName.length <= 50;
    }, [routineName]);

    const handleSave = async () => {
        if (!isValidName) return;
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        onSave(routineName.trim());
    };

    const handleStartNow = async () => {
        if (!isValidName) return;
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        onStartNow(routineName.trim());
    };

    if (!routine) return null;

    const muscleNames = routine.muscleGroups
        .filter(m => !['cardio', 'core'].includes(m))
        .map(m => MUSCLE_GROUPS[m]?.name)
        .join(' & ');

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 mb-3">
                    <span className="text-3xl">💾</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                    Save Your Routine
                </h3>
                <p className="text-zinc-400 text-sm">
                    Give it a memorable name
                </p>
            </div>

            {/* Name Input Card */}
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-800/40 rounded-2xl p-5 border border-zinc-700/50">
                <label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold block mb-3">
                    Routine Name
                </label>

                <div className="relative">
                    <input
                        type="text"
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                        maxLength={50}
                        className={`
              w-full bg-zinc-900/80 rounded-xl px-4 py-4
              text-white text-lg font-semibold
              border-2 transition-all duration-200
              focus:outline-none focus:ring-0
              ${isValidName
                                ? 'border-zinc-700 focus:border-emerald-500'
                                : 'border-red-500/50 focus:border-red-500'
                            }
            `}
                        placeholder="Enter routine name..."
                    />

                    {/* Edit icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                        ✏️
                    </div>
                </div>

                {/* Character count & validation */}
                <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs font-medium ${routineName.length < 2 ? 'text-red-400' : 'text-transparent'}`}>
                        Name too short
                    </span>
                    <span className={`text-xs font-medium ${routineName.length > 45 ? 'text-amber-400' : 'text-zinc-500'
                        }`}>
                        {routineName.length}/50
                    </span>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-700/30">
                <h4 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-4 text-center">
                    Summary
                </h4>

                <div className="grid grid-cols-2 gap-3">
                    {/* Muscles */}
                    <div className="bg-zinc-800/60 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">
                            {routine.muscleGroups.slice(0, 2).map(m => MUSCLE_GROUPS[m]?.icon).join('')}
                        </div>
                        <div className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                            Muscle Groups
                        </div>
                        <div className="text-white text-sm font-semibold truncate">
                            {muscleNames}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-zinc-800/60 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">⏱️</div>
                        <div className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                            Duration
                        </div>
                        <div className="text-white text-sm font-semibold">
                            ~{routine.totalTime} min
                        </div>
                    </div>

                    {/* Sets */}
                    <div className="bg-zinc-800/60 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                            Total Sets
                        </div>
                        <div className="text-white text-sm font-semibold">
                            {routine.totalSets} sets
                        </div>
                    </div>

                    {/* Exercises */}
                    <div className="bg-zinc-800/60 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">🏋️</div>
                        <div className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                            Exercises
                        </div>
                        <div className="text-white text-sm font-semibold">
                            {routine.totalExercises} exercises
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
                {/* Primary: Save */}
                <button
                    onClick={handleSave}
                    disabled={!isValidName || isSaving}
                    className={`
            w-full py-4 rounded-2xl font-bold text-lg
            flex items-center justify-center gap-3
            transition-all duration-300 relative overflow-hidden
            ${isValidName && !isSaving
                            ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                        }
          `}
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xl">💾</span>
                            <span>Save to My Routines</span>
                        </>
                    )}
                </button>

                {/* Secondary: Start Now */}
                <button
                    onClick={handleStartNow}
                    disabled={!isValidName || isSaving}
                    className={`
            w-full py-3.5 rounded-xl font-semibold
            border-2 transition-all duration-200
            flex items-center justify-center gap-2
            ${isValidName && !isSaving
                            ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 active:scale-[0.98]'
                            : 'border-zinc-700 text-zinc-500 cursor-not-allowed'
                        }
          `}
                >
                    <span className="text-lg">▶️</span>
                    Start This Workout Now
                </button>

                {/* Cancel */}
                <button
                    onClick={onCancel}
                    className="w-full text-center text-zinc-500 hover:text-zinc-300 text-sm py-2 
                     transition-colors duration-200 font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default SaveRoutineScreen;
