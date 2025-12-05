import React from 'react';
import { ExerciseHeader } from './ExerciseHeader';
import { SetRow } from './SetRow';
import { Button } from '../Shared/Button';
import { Icons } from '../../lib/icons';

export const ExerciseCard = ({ exercise, onUpdate, onRemove }) => {
    const handleSetChange = (index, field, value) => {
        const updated = { ...exercise };
        updated.sets[index] = { ...updated.sets[index], [field]: value };
        onUpdate(updated);
    };

    const handleSetToggle = (index) => {
        const updated = { ...exercise };
        updated.sets[index].done = !updated.sets[index].done;
        onUpdate(updated);
    };

    const addSet = () => {
        const updated = { ...exercise };
        // Logic to add set based on type (simplified)
        const lastSet = updated.sets[updated.sets.length - 1] || {};
        updated.sets.push({ ...lastSet, done: false });
        onUpdate(updated);
    };

    return (
        <div className="bg-dark-card border border-gray-800 rounded-xl shadow-lg mb-4 overflow-hidden">
            <ExerciseHeader exercise={exercise} onRemove={onRemove} />

            <div className="p-3 space-y-2">
                {/* Header Row */}
                <div className="grid grid-cols-[20px_1fr_1fr_1fr_60px_20px] gap-2 px-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">
                    <div>#</div>
                    {exercise.type === 'strength' && <><div>Kg</div><div>Reps</div><div>Goal</div></>}
                    {exercise.type === 'cardio' && <><div>Min</div><div>Km</div><div>Pace</div></>}
                    {exercise.type === 'abs' && <><div>Reps</div><div>Sec</div><div>-</div></>}
                    <div>Status</div>
                    <div></div>
                </div>

                {exercise.sets.map((set, i) => (
                    <SetRow
                        key={i}
                        index={i}
                        set={set}
                        type={exercise.type}
                        onChange={handleSetChange}
                        onToggle={handleSetToggle}
                    />
                ))}

                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-800">
                    <button onClick={addSet} className="text-neon-blue text-xs font-bold hover:underline flex items-center gap-1">
                        <Icons.Plus size={12} /> Add Set
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">REST:</span>
                        <span className="text-xs font-mono bg-dark-input px-2 py-1 rounded text-white">{exercise.restSeconds}s</span>
                        <Button variant="primary" className="!py-1 !px-3 !text-xs !min-h-[30px]">Start</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
