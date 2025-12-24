/**
 * WarmupCooldownCard
 * Premium collapsible card for displaying warmup/cooldown exercises
 * Mobile-optimized with modern design and lucide icons
 */

import React, { useState } from 'react';
import { Flame, Snowflake, ChevronDown, Check, Clock } from 'lucide-react';

/**
 * @param {Object} props
 * @param {'warmup' | 'cooldown'} props.type - Card type
 * @param {Object} props.data - { duration: number, exercises: Array<{ name: string, duration: string }> }
 * @param {Array<boolean>} props.completed - Array of completion status for each exercise
 * @param {Function} props.onToggleComplete - Callback (index) => void
 * @param {boolean} props.disabled - Whether the workout is locked
 */
export function WarmupCooldownCard({ type, data, completed = [], onToggleComplete, disabled = false }) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!data || !data.exercises || data.exercises.length === 0) {
        return null;
    }

    const isWarmup = type === 'warmup';
    const Icon = isWarmup ? Flame : Snowflake;
    const title = isWarmup ? 'Warm-Up' : 'Cool-Down';
    const description = isWarmup
        ? 'Prepare your muscles & joints'
        : 'Recovery & stretch';

    // Theme colors based on type
    const theme = isWarmup
        ? {
            bg: 'from-amber-500/10 via-amber-500/5 to-transparent',
            border: 'border-amber-500/30',
            icon: 'text-amber-400',
            iconBg: 'bg-amber-500/20',
            accent: 'text-amber-400',
            progressBg: 'bg-amber-500/20',
            progressFill: 'bg-amber-500',
            checkBg: 'bg-amber-500',
            hoverBg: 'hover:bg-amber-500/10'
        }
        : {
            bg: 'from-blue-500/10 via-blue-500/5 to-transparent',
            border: 'border-blue-500/30',
            icon: 'text-blue-400',
            iconBg: 'bg-blue-500/20',
            accent: 'text-blue-400',
            progressBg: 'bg-blue-500/20',
            progressFill: 'bg-blue-500',
            checkBg: 'bg-blue-500',
            hoverBg: 'hover:bg-blue-500/10'
        };

    const completedCount = completed.filter(Boolean).length;
    const totalCount = data.exercises.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const isComplete = completedCount === totalCount;

    return (
        <div className={`
            rounded-2xl overflow-hidden
            bg-gradient-to-br ${theme.bg}
            border ${theme.border}
            transition-all duration-300
            ${isComplete ? 'opacity-75' : ''}
        `}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    w-full flex items-center justify-between p-4
                    ${theme.hoverBg} transition-colors duration-200
                `}
            >
                <div className="flex items-center gap-3">
                    {/* Icon Container */}
                    <div className={`
                        w-12 h-12 rounded-xl ${theme.iconBg}
                        flex items-center justify-center
                        transition-transform duration-300
                        ${isComplete ? 'scale-90' : ''}
                    `}>
                        {isComplete ? (
                            <Check size={24} className={theme.icon} strokeWidth={3} />
                        ) : (
                            <Icon size={24} className={theme.icon} strokeWidth={2.5} />
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-lg ${isComplete ? 'text-zinc-400' : 'text-white'}`}>
                                {title}
                            </h3>
                            {isComplete && (
                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                    Done!
                                </span>
                            )}
                        </div>
                        <p className="text-zinc-500 text-sm">{description}</p>
                    </div>
                </div>

                {/* Right Side: Duration & Chevron */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <Clock size={14} />
                        <span className="text-sm font-medium">{data.duration} min</span>
                    </div>
                    <ChevronDown
                        size={20}
                        className={`text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Progress Bar */}
            {totalCount > 0 && (
                <div className="px-4 pb-3">
                    <div className={`h-1 rounded-full ${theme.progressBg} overflow-hidden`}>
                        <div
                            className={`h-full rounded-full ${theme.progressFill} transition-all duration-500 ease-out`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            {completedCount}/{totalCount} complete
                        </span>
                    </div>
                </div>
            )}

            {/* Collapsible Exercise List */}
            <div className={`
                overflow-hidden transition-all duration-300 ease-out
                ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="px-4 pb-4 space-y-2">
                    {data.exercises.map((exercise, index) => {
                        const isChecked = completed[index] || false;

                        return (
                            <button
                                key={index}
                                onClick={() => !disabled && onToggleComplete?.(index)}
                                disabled={disabled}
                                className={`
                                    w-full flex items-center justify-between p-3 rounded-xl
                                    border transition-all duration-200
                                    ${isChecked
                                        ? 'bg-zinc-800/50 border-zinc-700/50'
                                        : 'bg-zinc-800/80 border-zinc-700/80 hover:bg-zinc-700/60'}
                                    ${disabled ? 'cursor-not-allowed opacity-60' : 'active:scale-[0.98]'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Checkbox */}
                                    <div className={`
                                        w-6 h-6 rounded-lg border-2 flex items-center justify-center
                                        transition-all duration-200
                                        ${isChecked
                                            ? `${theme.checkBg} border-transparent`
                                            : `border-zinc-600 ${disabled ? '' : theme.hoverBg}`}
                                    `}>
                                        {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>

                                    {/* Exercise Name */}
                                    <span className={`
                                        font-medium text-sm
                                        ${isChecked ? 'text-zinc-500 line-through' : 'text-white'}
                                    `}>
                                        {exercise.name}
                                    </span>
                                </div>

                                {/* Duration */}
                                <span className={`
                                    text-sm font-medium
                                    ${isChecked ? 'text-zinc-600' : theme.accent}
                                `}>
                                    {exercise.duration}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default WarmupCooldownCard;
