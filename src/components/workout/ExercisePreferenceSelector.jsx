/**
 * ExercisePreferenceSelector
 * Step 4: Select compound/isolation preference
 * Unified design with consistent card styling
 */

import React from 'react';
import { EXERCISE_PREFERENCES } from '../../lib/fitnessConstants';

const prefConfig = {
    compound: {
        gradient: 'from-blue-500/15 to-blue-600/5',
        border: 'border-blue-500/40',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400'
    },
    balanced: {
        gradient: 'from-emerald-500/15 to-emerald-600/5',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400'
    },
    isolation: {
        gradient: 'from-violet-500/15 to-violet-600/5',
        border: 'border-violet-500/40',
        text: 'text-violet-400',
        badge: 'bg-violet-500/20 text-violet-400'
    }
};

export function ExercisePreferenceSelector({ selected, onChange }) {
    const preferences = Object.values(EXERCISE_PREFERENCES);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                    Exercise Style
                </h3>
                <p className="text-zinc-400 text-sm">
                    How should we build your routine?
                </p>
            </div>

            {/* Preference Cards */}
            <div className="space-y-3">
                {preferences.map((pref) => {
                    const isSelected = selected === pref.id;
                    const isRecommended = pref.id === 'balanced';
                    const config = prefConfig[pref.id];

                    return (
                        <button
                            key={pref.id}
                            onClick={() => onChange(pref.id)}
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
                                    {/* Preference header */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-2xl ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                            {pref.icon}
                                        </span>
                                        <span className={`text-lg font-semibold ${isSelected ? config.text : 'text-white'}`}>
                                            {pref.name}
                                        </span>

                                        {/* Recommended badge */}
                                        {isRecommended && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wide">
                                                Recommended
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-zinc-400 text-sm mb-1">
                                        {pref.description}
                                    </p>
                                    <p className="text-zinc-500 text-xs">
                                        {pref.subtext}
                                    </p>
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

export default ExercisePreferenceSelector;
