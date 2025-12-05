import React from 'react';
import { Icons } from '../../lib/icons';
import { IconButton } from '../Shared/Button';

export const ExerciseHeader = ({ exercise, onRemove, onLink }) => {
    return (
        <div className="flex justify-between items-center p-3 bg-dark-card border-b border-gray-800 rounded-t-xl">
            <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">{exercise.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <IconButton icon={Icons.Link} onClick={onLink} className="text-gray-500 hover:text-neon-blue" />
                <IconButton icon={Icons.Trash} onClick={onRemove} className="text-gray-500 hover:text-red-500" />
            </div>
        </div>
    );
};
