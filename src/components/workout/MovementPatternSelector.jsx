/**
 * MovementPatternSelector
 * Step 2: Select movement pattern (Push/Pull/Mixed)
 * Unified glassmorphic card design with consistent styling
 */

import React from 'react';
import { MOVEMENT_PATTERNS } from '../../lib/fitnessConstants';

const patternConfig = {
    push: {
        examples: ['Bench Press', 'Shoulder Press', 'Tricep Dips'],
        muscles: 'Chest, Shoulders, Triceps',
        gradient: 'from-blue-500/15 to-blue-600/5',
        border: 'border-blue-500/40',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400'
    },
    pull: {
        examples: ['Deadlift', 'Pull-ups', 'Bicep Curls'],
        muscles: 'Back, Biceps, Rear Delts',
        gradient: 'from-emerald-500/15 to-emerald-600/5',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400'
    },
    mixed: {
        examples: ['Supersets', 'Full Body', 'Circuits'],
        muscles: 'Antagonist muscle pairing',
        gradient: 'from-violet-500/15 to-violet-600/5',
        border: 'border-violet-500/40',
        text: 'text-violet-400',
        badge: 'bg-violet-500/20 text-violet-400'
    }
};

export function MovementPatternSelector({ selected, onChange, detectedPattern }) {
    const patterns = Object.values(MOVEMENT_PATTERNS);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                    Movement Pattern
                </h3>
                <p className="text-zinc-400 text-sm">
                    {detectedPattern
                        ? `Recommended: ${MOVEMENT_PATTERNS[detectedPattern]?.name}`
                        : 'Choose your training focus'}
                </p>
            </div>

            {/* Pattern Cards */}
            <div className="space-y-3">
                {patterns.map((pattern) => {
                    const isSelected = selected === pattern.id;
                    const isDetected = pattern.id === detectedPattern;
                    const config = patternConfig[pattern.id];

                    return (
                        <button
                            key={pattern.id}
                            onClick={() => onChange(pattern.id)}
                            className={`
                w-full p-4 rounded-2xl border-2 text-left
                transition-all duration-300 ease-out
                active:scale-[0.98]
                ${isSelected
                                    ? `bg-gradient-to-br ${config.gradient} ${config.border} shadow-lg`
                                    : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600'
                                }
              `}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Pattern header */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-2xl ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                            {pattern.icon}
                                        </span>
                                        <span className={`text-lg font-semibold ${isSelected ? config.text : 'text-white'}`}>
                                            {pattern.name}
                                        </span>

                                        {/* Badges */}
                                        {isDetected && !isSelected && (
                                            <span className="px-2 py-0.5 rounded-full bg-zinc-700/80 text-zinc-400 text-[10px] font-semibold uppercase tracking-wide">
                                                Auto-detected
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-zinc-400 text-sm mb-3">
                                        {config.muscles}
                                    </p>

                                    {/* Example exercises */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {config.examples.map((ex, i) => (
                                            <span
                                                key={i}
                                                className={`px-2 py-1 rounded-lg text-[11px] font-medium ${isSelected ? config.badge : 'bg-zinc-700/60 text-zinc-400'
                                                    }`}
                                            >
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Selection indicator */}
                                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 ml-3 flex-shrink-0
                  ${isSelected
                                        ? `${config.text.replace('text', 'bg')} border-transparent`
                                        : 'border-zinc-600 bg-transparent'
                                    }
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
        </div>
    );
}

export default MovementPatternSelector;
