import React from 'react';
import { Copy, Plus, Clock, Move, Sparkles } from 'lucide-react';

export const QuickChips = ({ type, mode, onAdjust, onCopy, canCopy, suggestions = [], onSuggestion, className, subset = null }) => {
    // Styling constants
    const chipBase = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95 border shadow-sm min-w-max flex-shrink-0";

    // Theme logic
    const styles = {
        blue: `${chipBase} bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20`,
        emerald: `${chipBase} bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/20`,
        amber: `${chipBase} bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20`,
        zinc: `${chipBase} bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700`,
        ai: `${chipBase} bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/20 ring-1 ring-violet-500/20`,
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
                    <Icon size={12} className="mr-0.5" />
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
                    <button onClick={() => onAdjust('reps', 5)} className={styles.amber}>
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
                    <button onClick={() => onAdjust('weight', 2.5)} className={styles.blue}>
                        +2.5
                    </button>
                    <button onClick={() => onAdjust('weight', 5)} className={styles.blue}>
                        +5
                    </button>
                    <button onClick={() => onAdjust('weight', 10)} className={styles.blue}>
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
