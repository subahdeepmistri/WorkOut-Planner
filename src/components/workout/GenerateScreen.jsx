/**
 * GenerateScreen
 * Step 5: Summary and generate button
 * Premium loading animation and summary card design
 */

import React from 'react';
import { MUSCLE_GROUPS, EXPERIENCE_LEVELS, MOVEMENT_PATTERNS, EXERCISE_PREFERENCES } from '../../lib/fitnessConstants';
import {
    Sparkles, Rocket, Footprints, Dumbbell, ArrowDownLeft, Triangle, Sword,
    Heart, Target, Trophy, Scale, ArrowUpRight, ArrowLeftRight
} from 'lucide-react';

// Icon mapping for muscle groups
const MUSCLE_ICON_MAP = {
    legs: { Icon: Footprints, color: 'text-violet-400' },
    chest: { Icon: Dumbbell, color: 'text-blue-400' },
    back: { Icon: ArrowDownLeft, color: 'text-emerald-400' },
    shoulders: { Icon: Triangle, color: 'text-amber-400' },
    arms: { Icon: Sword, color: 'text-red-400' }
};

// Icon mapping for preferences  
const PREF_ICON_MAP = {
    compound: { Icon: Trophy, color: 'text-blue-400' },
    balanced: { Icon: Scale, color: 'text-emerald-400' },
    isolation: { Icon: Target, color: 'text-violet-400' }
};

// Pattern icon mapping
const PATTERN_ICON_MAP = {
    push: { Icon: ArrowUpRight, color: 'text-blue-400' },
    pull: { Icon: ArrowDownLeft, color: 'text-emerald-400' },
    mixed: { Icon: ArrowLeftRight, color: 'text-violet-400' }
};

// Helper component for muscle icons in config
const ConfigMuscleIcon = ({ muscleId }) => {
    const iconData = MUSCLE_ICON_MAP[muscleId];
    if (!iconData) return null;
    const { Icon, color } = iconData;
    return <Icon size={18} className={color} strokeWidth={2.5} />;
};

export function GenerateScreen({ config, isGenerating, onGenerate, onEdit }) {
    const { muscleGroups, movementPattern, level, preference, includeCardio, includeCore } = config;

    const primaryMuscles = muscleGroups.filter(m => !['cardio', 'core'].includes(m));
    const muscleNames = primaryMuscles.map(m => MUSCLE_GROUPS[m]?.name).join(' & ');
    const patternName = MOVEMENT_PATTERNS[movementPattern]?.name || movementPattern;
    const levelData = EXPERIENCE_LEVELS[level];
    const prefName = EXERCISE_PREFERENCES[preference]?.name || preference;
    const prefIcon = PREF_ICON_MAP[preference];
    const patternIcon = PATTERN_ICON_MAP[movementPattern];

    // Loading State
    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] space-y-8 px-4">
                {/* Animated AI Robot */}
                <div className="relative">
                    {/* Outer pulse ring */}
                    <div className="absolute inset-0 w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                    {/* Middle ring */}
                    <div className="absolute inset-2 w-24 h-24 rounded-full border-2 border-emerald-500/30" />
                    {/* Spinner ring */}
                    <div className="absolute inset-0 w-28 h-28 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" style={{ animationDuration: '1.5s' }} />
                    {/* Icon container */}
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                        <Sparkles size={48} className="text-emerald-400 animate-pulse" strokeWidth={2} />
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-white">
                        Generating Your Routine...
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Selecting optimal exercises</span>
                    </div>
                </div>

                {/* Animated progress bar */}
                <div className="w-56 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 animate-shimmer"
                        style={{
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s ease-in-out infinite'
                        }}
                    />
                </div>

                <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
            </div>
        );
    }

    // Ready State
    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 mb-3">
                    <Sparkles size={28} className="text-emerald-400" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                    Ready to Generate
                </h3>
                <p className="text-zinc-400 text-sm">
                    Review your selections below
                </p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-800/40 rounded-2xl p-5 border border-zinc-700/50">
                <h4 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-4">
                    Your Configuration
                </h4>

                <div className="space-y-4">
                    {/* Muscles */}
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                        <span className="text-zinc-400 text-sm">Muscle Groups</span>
                        <div className="flex items-center gap-2">
                            {primaryMuscles.map(m => (
                                <ConfigMuscleIcon key={m} muscleId={m} />
                            ))}
                            <span className="text-white font-medium">{muscleNames}</span>
                        </div>
                    </div>

                    {/* Pattern */}
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                        <span className="text-zinc-400 text-sm">Pattern</span>
                        <span className={`font-medium flex items-center gap-2 ${movementPattern === 'push' ? 'text-blue-400' :
                            movementPattern === 'pull' ? 'text-emerald-400' : 'text-violet-400'
                            }`}>
                            {patternIcon && <patternIcon.Icon size={16} />} {patternName}
                        </span>
                    </div>

                    {/* Level */}
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                        <span className="text-zinc-400 text-sm">Level</span>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[1, 2, 3].map((dot) => (
                                    <div
                                        key={dot}
                                        className={`w-2 h-2 rounded-full ${dot <= levelData?.dots
                                            ? level === 'beginner' ? 'bg-emerald-500' :
                                                level === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                                            : 'bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className={`font-medium ${level === 'beginner' ? 'text-emerald-400' :
                                level === 'moderate' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                {levelData?.name}
                            </span>
                        </div>
                    </div>

                    {/* Preference */}
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                        <span className="text-zinc-400 text-sm">Style</span>
                        <span className="text-white font-medium flex items-center gap-2">
                            {prefIcon && <prefIcon.Icon size={16} className={prefIcon.color} />} {prefName}
                        </span>
                    </div>

                    {/* Finishers */}
                    {(includeCardio || includeCore) && (
                        <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                            <span className="text-zinc-400 text-sm">Finishers</span>
                            <div className="flex gap-3">
                                {includeCardio && (
                                    <span className="text-pink-400 font-medium flex items-center gap-1.5">
                                        <Heart size={14} /> Cardio
                                    </span>
                                )}
                                {includeCore && (
                                    <span className="text-cyan-400 font-medium flex items-center gap-1.5">
                                        <Target size={14} /> Core
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Estimated time */}
                    <div className="flex items-center justify-between py-2">
                        <span className="text-zinc-400 text-sm">Est. Duration</span>
                        <span className="text-white font-semibold">~65-75 min</span>
                    </div>
                </div>
            </div>

            {/* Generate Button - Premium CTA */}
            <button
                onClick={onGenerate}
                className="w-full py-4 rounded-2xl font-bold text-lg
                   bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600
                   hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500
                   text-white shadow-xl shadow-emerald-500/30
                   transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                   flex items-center justify-center gap-3
                   relative overflow-hidden group"
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Rocket size={22} className="relative" strokeWidth={2.5} />
                <span className="relative">Generate My Routine</span>
            </button>

            {/* Edit link */}
            <button
                onClick={onEdit}
                className="w-full text-center text-zinc-500 hover:text-zinc-300 text-sm py-2 
                   transition-colors duration-200 font-medium"
            >
                ← Edit Selections
            </button>
        </div>
    );
}

export default GenerateScreen;
