import React from 'react';
import clsx from 'clsx';
import { Icons } from '../../lib/icons';

export const SetRow = ({ set, index, type, onChange, onToggle }) => {
    const isCompleted = set.done;

    const handleChange = (field, value) => {
        onChange(index, field, value);
    };

    return (
        <div className={clsx(
            "grid gap-2 items-center p-2 rounded-lg transition-colors",
            type === 'strength' ? "grid-cols-[20px_1fr_1fr_1fr_60px_20px]" :
                type === 'cardio' ? "grid-cols-[20px_1fr_1fr_1fr_60px_20px]" :
                    "grid-cols-[20px_1fr_1fr_1fr_60px_20px]", // Abs
            isCompleted ? "bg-neon-green/10" : "hover:bg-white/5"
        )}>
            <span className="text-gray-500 text-xs font-mono">{index + 1}</span>

            {/* Inputs based on type */}
            {type === 'strength' && (
                <>
                    <Input
                        value={set.weight}
                        onChange={(v) => handleChange('weight', v)}
                        placeholder="kg"
                    />
                    <Input
                        value={set.reps}
                        onChange={(v) => handleChange('reps', v)}
                        placeholder="reps"
                    />
                    <div className="text-center text-gray-500 text-sm font-mono">{set.targetReps}</div>
                </>
            )}

            {type === 'cardio' && (
                <>
                    <Input
                        value={set.time}
                        onChange={(v) => handleChange('time', v)}
                        placeholder="min"
                    />
                    <Input
                        value={set.distance}
                        onChange={(v) => handleChange('distance', v)}
                        placeholder="km"
                    />
                    <div className="text-center text-gray-500 text-sm">-</div>
                </>
            )}

            {type === 'abs' && (
                <>
                    <Input
                        value={set.reps}
                        onChange={(v) => handleChange('reps', v)}
                        placeholder="reps"
                    />
                    <Input
                        value={set.holdTime}
                        onChange={(v) => handleChange('holdTime', v)}
                        placeholder="sec"
                    />
                    <div className="text-center text-gray-500 text-sm">-</div>
                </>
            )}

            <button
                onClick={() => onToggle(index)}
                className={clsx(
                    "w-full py-1 rounded text-xs font-bold uppercase transition-all",
                    isCompleted
                        ? "bg-neon-green text-black shadow-[0_0_5px_rgba(57,255,20,0.5)]"
                        : "bg-dark-input text-gray-400 hover:text-white"
                )}
            >
                {isCompleted ? 'Done' : 'Log'}
            </button>

            <button className="text-gray-600 hover:text-red-500">
                <Icons.X size={14} />
            </button>
        </div>
    );
};

const Input = ({ value, onChange, placeholder }) => (
    <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        className="w-full bg-transparent text-center text-white font-mono text-sm border-b border-gray-700 focus:border-neon-green focus:outline-none py-1"
    />
);
