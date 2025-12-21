import React from 'react';
import { Copy, Plus, Clock, Move, Sparkles } from 'lucide-react';

export const QuickChips = ({ type, mode, onAdjust, onCopy, canCopy, suggestions = [], onSuggestion, className, subset = null }) => {
    // Styling constants
    const chipBase = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95 border min-w-max flex-shrink-0";

    /**
     * DARK MODE COLOR AUDIT:
     * - Outline only
     * - Low Saturation
     * - No Glows
     * - Text brighter than border
     */
    const styles = {
        // Indigo (Strength) - Muted Outline
        indigo: `${chipBase} bg-transparent text-indigo-500 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700`,

        // Emerald (Core/Time) - Muted Outline
        emerald: `${chipBase} bg-transparent text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-700`,

        // Amber (Reps) - Muted Outline
        amber: `${chipBase} bg-transparent text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-700`,

        // Zinc (Copy/Neutral) - Muted Outline
        zinc: `${chipBase} bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200`,

        // AI (Violet) - Muted Outline
        ai: `${chipBase} bg-transparent text-violet-500 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-500/10 ring-0`,
    };

    const showAi = !subset || subset.includes('ai');
    const showDist = !subset || subset.includes('distance');
    const showTime = !subset || subset.includes('time');
    const showWeight = !subset || subset.includes('weight');
    const showReps = !subset || subset.includes('reps');
    const showCopy = !subset || subset.includes('copy');

    const renderSuggestions = () => {
        if (!showAi || !suggestions || suggestions.length === 0) return null;
        return suggestions.map((s, i) => {
            const Icon = s.icon || Sparkles;
            return (
                <button
                    key={`ai-${i}`}
                    onClick={() => onSuggestion(s)}
                    className={s.style && styles[s.style] ? styles[s.style] : styles.ai}
                    title="AI Suggestion"
                >
                    <Icon size={12} className="mr-0.5 opacity-80" />
                    {s.label}
                </button>
            )
        });
    };

    if (type === 'cardio') {
        return (
            <div className={`flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200 ${className || ''}`}>
                {renderSuggestions()}
            </div>
        );
    }

    if (type === 'abs') {
        return (
            <div className={`flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200 ${className || ''}`}>
                {renderSuggestions()}

                {showReps && mode !== 'hold' && (
                    <button onClick={() => onAdjust('reps', 5)} className={styles.emerald}>
                        +5 Reps
                    </button>
                )}
                {showTime && mode === 'hold' && (
                    <button onClick={() => onAdjust('holdTime', 15)} className={styles.emerald}>
                        +15s
                    </button>
                )}
                {showCopy && canCopy && (
                    <button onClick={onCopy} className={styles.zinc}>
                        <Copy size={10} className="mr-0.5" /> Same
                    </button>
                )}
            </div>
        );
    }

    // Default: Strength
    return (
        <div className={`flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200 ${className || ''}`}>
            {renderSuggestions()}

            {showWeight && (
                <>
                    <button onClick={() => onAdjust('weight', 2.5)} className={styles.indigo}>
                        +2.5
                    </button>
                    <button onClick={() => onAdjust('weight', 5)} className={styles.indigo}>
                        +5
                    </button>
                    <button onClick={() => onAdjust('weight', 10)} className={styles.indigo}>
                        +10
                    </button>
                </>
            )}

            {showCopy && canCopy && (
                <button onClick={onCopy} className={styles.zinc} title="Copy set">
                    <Copy size={10} className="mr-0.5" /> Same
                </button>
            )}
        </div>
    );
};
