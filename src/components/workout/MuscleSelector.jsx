/**
 * MuscleSelector
 * Step 1: Unified focus selection - Choose Workout Format OR Muscle Groups
 * Quick Select and Custom are COMPLETELY INDEPENDENT
 * The selected format or muscles are passed to the generator separately
 */

import React, { useState } from 'react';
import { MUSCLE_GROUPS } from '../../lib/fitnessConstants';

// Color mapping for gradient backgrounds
const colorStyles = {
    violet: { from: 'from-violet-500/20', to: 'to-violet-600/10', border: 'border-violet-500/40', text: 'text-violet-400', bg: 'bg-violet-500' },
    blue: { from: 'from-blue-500/20', to: 'to-blue-600/10', border: 'border-blue-500/40', text: 'text-blue-400', bg: 'bg-blue-500' },
    emerald: { from: 'from-emerald-500/20', to: 'to-emerald-600/10', border: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500' },
    amber: { from: 'from-amber-500/20', to: 'to-amber-600/10', border: 'border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-500' },
    red: { from: 'from-red-500/20', to: 'to-red-600/10', border: 'border-red-500/40', text: 'text-red-400', bg: 'bg-red-500' },
    pink: { from: 'from-pink-500/20', to: 'to-pink-600/10', border: 'border-pink-500/40', text: 'text-pink-400', bg: 'bg-pink-500' },
    cyan: { from: 'from-cyan-500/20', to: 'to-cyan-600/10', border: 'border-cyan-500/40', text: 'text-cyan-400', bg: 'bg-cyan-500' }
};

// Workout format configurations - PRESET muscle combinations
// These are NOT linked to Custom tab selections
export const workoutFormats = {
    push: {
        id: 'push',
        name: 'Push Day',
        icon: '💪',
        description: 'Chest, Shoulders & Triceps',
        // Include arms - generator filters by pattern to get triceps exercises
        presetMuscles: ['chest', 'shoulders', 'arms'],
        pattern: 'push',
        gradient: 'from-blue-500/20 to-blue-600/10',
        border: 'border-blue-500/40',
        text: 'text-blue-400',
        bg: 'bg-blue-500'
    },
    pull: {
        id: 'pull',
        name: 'Pull Day',
        icon: '🏋️',
        description: 'Back, Biceps & Rear Delts',
        // Include shoulders (rear delts have pull pattern) + arms for biceps
        presetMuscles: ['back', 'shoulders', 'arms'],
        pattern: 'pull',
        gradient: 'from-emerald-500/20 to-emerald-600/10',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500'
    },
    legs: {
        id: 'legs',
        name: 'Leg Day',
        icon: '🔥',
        description: 'Quads, Hamstrings, Glutes & Calves',
        presetMuscles: ['legs'],
        pattern: 'mixed',
        isBrutal: true, // Flag for extra intensity
        gradient: 'from-amber-500/20 to-amber-600/10',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        bg: 'bg-amber-500'
    },
    fullbody: {
        id: 'fullbody',
        name: 'Full Body',
        icon: '⚡',
        description: 'All muscle groups combined',
        presetMuscles: ['chest', 'back', 'legs', 'shoulders', 'arms'],
        pattern: 'mixed',
        gradient: 'from-violet-500/20 to-violet-600/10',
        border: 'border-violet-500/40',
        text: 'text-violet-400',
        bg: 'bg-violet-500'
    }
};

export function MuscleSelector({
    // Custom mode muscles
    customMuscles = [],
    onCustomMusclesChange,
    // Quick Select format
    selectedFormat,
    onFormatChange,
    // Finishers
    includeCardio,
    onCardioChange,
    includeCore,
    onCoreChange,
    // Pattern (auto-set based on selection)
    onPatternChange
}) {
    const [selectionMode, setSelectionMode] = useState(selectedFormat ? 'format' : 'format');

    const primaryGroups = Object.values(MUSCLE_GROUPS).filter(g => !g.isFinisher);
    const canSelectMore = customMuscles.length < 2;

    // Handle mode change - switching tabs
    const handleModeChange = (newMode) => {
        setSelectionMode(newMode);
        // When switching modes, we DON'T clear anything
        // Each mode maintains its own independent state
    };

    // Handle Quick Select format selection
    const handleFormatSelect = (formatId) => {
        const format = workoutFormats[formatId];

        // Set the selected format
        onFormatChange(formatId);

        // Set movement pattern based on format
        onPatternChange(format.pattern);
    };

    // Handle Custom muscle toggle
    const handleMuscleToggle = (muscleId) => {
        if (customMuscles.includes(muscleId)) {
            onCustomMusclesChange(customMuscles.filter(id => id !== muscleId));
        } else if (canSelectMore) {
            onCustomMusclesChange([...customMuscles, muscleId]);

            // Auto-detect pattern for custom selection
            const newMuscles = [...customMuscles, muscleId];
            const patterns = newMuscles.map(m => MUSCLE_GROUPS[m]?.movementPattern);
            if (patterns.every(p => p === 'push')) {
                onPatternChange('push');
            } else if (patterns.every(p => p === 'pull')) {
                onPatternChange('pull');
            } else {
                onPatternChange('mixed');
            }
        }
    };

    // Determine if we have a valid selection in current mode
    const hasValidSelection = selectionMode === 'format'
        ? selectedFormat !== null
        : customMuscles.length > 0;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-white mb-1">
                    Choose Your Focus
                </h3>
                <p className="text-zinc-400 text-sm">
                    {selectionMode === 'format'
                        ? 'Select a workout type'
                        : 'Pick up to 2 muscle groups'}
                </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-zinc-800/60 rounded-xl p-1 mb-6">
                <button
                    onClick={() => handleModeChange('format')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${selectionMode === 'format'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    ⚡ Quick Select
                </button>
                <button
                    onClick={() => handleModeChange('custom')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${selectionMode === 'custom'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    🎯 Custom
                </button>
            </div>

            {/* Quick Select Mode - Workout Formats */}
            {selectionMode === 'format' && (
                <div className="space-y-3 mb-6">
                    {Object.values(workoutFormats).map((format) => {
                        const isSelected = selectedFormat === format.id;

                        return (
                            <button
                                key={format.id}
                                onClick={() => handleFormatSelect(format.id)}
                                className={`
                  w-full p-4 rounded-2xl border-2 text-left
                  transition-all duration-300 ease-out active:scale-[0.98]
                  ${isSelected
                                        ? `bg-gradient-to-br ${format.gradient} ${format.border} shadow-lg`
                                        : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600'
                                    }
                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? format.bg + '/30' : 'bg-zinc-700/50'
                                            }`}>
                                            <span className="text-2xl">{format.icon}</span>
                                        </div>
                                        <div>
                                            <div className={`font-semibold text-lg ${isSelected ? format.text : 'text-white'}`}>
                                                {format.name}
                                            </div>
                                            <div className="text-zinc-400 text-sm">
                                                {format.description}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 flex-shrink-0
                    ${isSelected ? `${format.bg} border-transparent` : 'border-zinc-600 bg-transparent'}
                  `}>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Custom Mode - Individual Muscles (INDEPENDENT from Quick Select) */}
            {selectionMode === 'custom' && (
                <>
                    {/* Selection count */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-zinc-400 text-sm">Selected:</span>
                        {[1, 2].map(num => (
                            <div
                                key={num}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${customMuscles.length >= num ? 'bg-emerald-500 scale-110' : 'bg-zinc-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Muscle Grid - Shows independent state from Quick Select */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {primaryGroups.map((muscle) => {
                            const isSelected = customMuscles.includes(muscle.id);
                            const isDisabled = !isSelected && !canSelectMore;
                            const colors = colorStyles[muscle.color] || colorStyles.emerald;

                            return (
                                <button
                                    key={muscle.id}
                                    onClick={() => handleMuscleToggle(muscle.id)}
                                    disabled={isDisabled}
                                    className={`
                    relative p-4 rounded-2xl border-2 
                    flex flex-col items-center justify-center gap-2
                    transition-all duration-300 ease-out
                    ${isSelected
                                            ? `bg-gradient-to-br ${colors.from} ${colors.to} ${colors.border} shadow-lg`
                                            : 'bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600'
                                        }
                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}
                  `}
                                    style={{ minHeight: '100px' }}
                                >
                                    {isSelected && (
                                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center`}>
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className={`text-3xl ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                        {muscle.icon}
                                    </span>
                                    <span className={`text-xs font-semibold uppercase tracking-wide ${isSelected ? colors.text : 'text-zinc-300'}`}>
                                        {muscle.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Finisher Toggle Section */}
            <div className="border-t border-zinc-800 pt-5">
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-4 text-center">
                    Add Finishers (Optional)
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => onCardioChange(!includeCardio)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl border-2
              transition-all duration-300 active:scale-95
              ${includeCardio
                                ? 'bg-pink-500/15 border-pink-500/40 text-pink-400'
                                : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                            }
            `}
                    >
                        <span className="text-lg">❤️‍🔥</span>
                        <span className="text-sm font-medium">Cardio</span>
                        {includeCardio && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => onCoreChange(!includeCore)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl border-2
              transition-all duration-300 active:scale-95
              ${includeCore
                                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                                : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                            }
            `}
                    >
                        <span className="text-lg">🎯</span>
                        <span className="text-sm font-medium">Core</span>
                        {includeCore && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Selected Summary */}
            {hasValidSelection && (
                <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-zinc-400 text-sm">Focus: </span>
                    <span className="text-white font-semibold">
                        {selectionMode === 'format' && selectedFormat
                            ? workoutFormats[selectedFormat].name
                            : customMuscles.map(id => MUSCLE_GROUPS[id]?.name).join(' & ')
                        }
                    </span>
                    {(includeCardio || includeCore) && (
                        <span className="text-zinc-500 text-sm">
                            {' '}+ {[includeCardio && 'Cardio', includeCore && 'Core'].filter(Boolean).join(', ')}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default MuscleSelector;
