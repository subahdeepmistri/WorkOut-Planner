/**
 * LevelSelector
 * Step 3: Select experience level
 * Unified design with color-coded levels and smooth transitions
 */

import React from 'react';
import { EXPERIENCE_LEVELS } from '../../lib/fitnessConstants';

const levelConfig = {
    beginner: {
        gradient: 'from-emerald-500/15 to-emerald-600/5',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500'
    },
    moderate: {
        gradient: 'from-amber-500/15 to-amber-600/5',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        dot: 'bg-amber-500'
    },
    advanced: {
        gradient: 'from-red-500/15 to-red-600/5',
        border: 'border-red-500/40',
        text: 'text-red-400',
        dot: 'bg-red-500'
    }
};

export function LevelSelector({ selected, onChange }) {
    const levels = Object.values(EXPERIENCE_LEVELS);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                    Experience Level
                </h3>
                <p className="text-zinc-400 text-sm">
                    This affects exercise selection & volume
                </p>
            </div>

            {/* Level Cards */}
            <div className="space-y-3">
                {levels.map((level) => {
                    const isSelected = selected === level.id;
                    const config = levelConfig[level.id];

                    return (
                        <button
                            key={level.id}
                            onClick={() => onChange(level.id)}
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Level dots indicator */}
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3].map((dot) => (
                                            <div
                                                key={dot}
                                                className={`
                          w-3 h-3 rounded-full transition-all duration-300
                          ${dot <= level.dots
                                                        ? isSelected ? config.dot : 'bg-zinc-500'
                                                        : 'bg-zinc-700'
                                                    }
                        `}
                                            />
                                        ))}
                                    </div>

                                    {/* Level info */}
                                    <div>
                                        <div className={`font-semibold text-lg ${isSelected ? config.text : 'text-white'}`}>
                                            {level.name}
                                        </div>
                                        <div className="text-zinc-400 text-sm">
                                            {level.description}
                                        </div>
                                        <div className="text-zinc-500 text-xs mt-0.5">
                                            {level.subtext}
                                        </div>
                                    </div>
                                </div>

                                {/* Selection indicator */}
                                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 flex-shrink-0
                  ${isSelected
                                        ? `${config.dot} border-transparent`
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

            {/* Info note */}
            <div className="mt-5 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
                <p className="text-zinc-400 text-xs text-center leading-relaxed">
                    💡 <span className="text-emerald-400">Beginners</span> get safer exercises with longer rest.
                    <span className="text-red-400"> Advanced</span> gets higher volume & intensity.
                </p>
            </div>
        </div>
    );
}

export default LevelSelector;
