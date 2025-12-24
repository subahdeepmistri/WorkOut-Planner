/**
 * RoutineCreationChoice
 * Modern glassmorphic choice screen - AI generation or manual creation
 * Premium design with smooth hover effects and gradient accents
 */

import React from 'react';
import { Dumbbell, Sparkles, PenLine } from 'lucide-react';

export function RoutineCreationChoice({ onChooseAI, onChooseManual, onCancel }) {
    return (
        <div className="w-full max-w-md mx-auto px-4 py-6">
            {/* Header with gradient text */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 mb-4">
                    <Dumbbell size={32} className="text-emerald-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                    Build Your Routine
                </h3>
                <p className="text-zinc-400 text-sm">
                    Choose your preferred creation method
                </p>
            </div>

            {/* Option Cards */}
            <div className="space-y-4">
                {/* AI Generation Option - Primary */}
                <button
                    onClick={onChooseAI}
                    className="w-full group relative overflow-hidden rounded-2xl 
                     bg-gradient-to-br from-emerald-500/15 via-emerald-600/10 to-zinc-900/80
                     border border-emerald-500/30 
                     hover:border-emerald-400/50 hover:from-emerald-500/25
                     active:scale-[0.98] transition-all duration-300"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/10 to-emerald-500/0 
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    <div className="relative p-5">
                        <div className="flex items-start gap-4">
                            {/* Icon container */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl 
                            bg-gradient-to-br from-emerald-500/30 to-emerald-600/20
                            flex items-center justify-center
                            group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <Sparkles size={28} className="text-emerald-300" strokeWidth={2} />
                            </div>

                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-lg font-semibold text-white">
                                        AI-Powered
                                    </h4>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                                 bg-emerald-500/30 text-emerald-300 rounded-full">
                                        Recommended
                                    </span>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                                    Smart algorithm creates an optimized routine based on your goals
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['7 Steps', 'Auto-balanced', 'Time-optimized'].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-zinc-800/80 rounded-lg text-[11px] text-zinc-400 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 
                            flex items-center justify-center
                            group-hover:bg-emerald-500/30 group-hover:translate-x-1 transition-all duration-300">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Manual Creation Option - Secondary */}
                <button
                    onClick={onChooseManual}
                    className="w-full group relative overflow-hidden rounded-2xl 
                     bg-zinc-800/40 border border-zinc-700/50 
                     hover:bg-zinc-800/70 hover:border-zinc-600
                     active:scale-[0.98] transition-all duration-300"
                >
                    <div className="relative p-5">
                        <div className="flex items-start gap-4">
                            {/* Icon container */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-zinc-700/50
                            flex items-center justify-center
                            group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <PenLine size={28} className="text-zinc-300" strokeWidth={2} />
                            </div>

                            <div className="flex-1 text-left">
                                <h4 className="text-lg font-semibold text-white mb-1">
                                    Build from Scratch
                                </h4>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                                    Full control – add exercises one by one
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[11px] font-medium">
                                        + Strength
                                    </span>
                                    <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-[11px] font-medium">
                                        + Cardio
                                    </span>
                                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-[11px] font-medium">
                                        + Core
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700/50 
                            flex items-center justify-center
                            group-hover:bg-zinc-600 group-hover:translate-x-1 transition-all duration-300">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            {/* Cancel button */}
            <button
                onClick={onCancel}
                className="w-full mt-8 py-3 text-zinc-500 hover:text-zinc-300 text-sm font-medium 
                   transition-colors duration-200"
            >
                Cancel
            </button>
        </div>
    );
}

export default RoutineCreationChoice;
