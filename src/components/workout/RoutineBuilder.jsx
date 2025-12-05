import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const RoutineBuilder = ({ onSave, onCancel }) => {
    const [name, setName] = useState("New Routine");

    return (
        <div className="bg-zinc-900 p-4 rounded-xl space-y-4 shadow-lg border border-zinc-700">
            <h3 className="text-lg font-bold text-white mb-2">Build New Routine</h3>
            <div className="space-y-1">
                <label className="text-xs text-zinc-400">Routine Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 focus:border-blue-500 outline-none"
                    placeholder="e.g. Back & Biceps"
                />
            </div>
            <div className="flex gap-3 pt-2">
                <Button onClick={() => onSave({ id: Date.now().toString(), name, exercises: [] })} className="flex-1 bg-green-600 hover:bg-green-500 text-white">
                    Create & Start Builder
                </Button>
                <Button onClick={onCancel} variant="secondary" className="flex-1">
                    Cancel
                </Button>
            </div>
        </div>
    );
};
