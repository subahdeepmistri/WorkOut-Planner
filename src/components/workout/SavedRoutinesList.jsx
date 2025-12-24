/**
 * SavedRoutinesList
 * Display and manage saved custom routines
 */

import React, { useState } from 'react';
import { MUSCLE_GROUPS, EXPERIENCE_LEVELS } from '../../lib/fitnessConstants';

/**
 * SavedRoutinesList Component
 * @param {Array} routines - List of saved routines
 * @param {Function} onSelect - Callback when a routine is selected
 * @param {Function} onDelete - Callback to delete a routine
 * @param {Function} onDuplicate - Callback to duplicate a routine
 * @param {Function} onToggleFavorite - Callback to toggle favorite
 */
export function SavedRoutinesList({
    routines,
    onSelect,
    onDelete,
    onDuplicate,
    onToggleFavorite,
    emptyMessage = "No custom routines yet"
}) {
    const [expandedId, setExpandedId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    if (!routines || routines.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-4xl mb-3">🏋️</div>
                <p className="text-zinc-400">{emptyMessage}</p>
                <p className="text-zinc-500 text-sm mt-1">Create your first AI routine!</p>
            </div>
        );
    }

    const handleDelete = (id) => {
        setDeleteConfirmId(null);
        onDelete?.(id);
    };

    // Separate favorites and regular
    const favorites = routines.filter(r => r.isFavorite);
    const regular = routines.filter(r => !r.isFavorite);

    const renderRoutineCard = (routine) => {
        const isExpanded = expandedId === routine.id;
        const isDeleting = deleteConfirmId === routine.id;
        const levelData = EXPERIENCE_LEVELS[routine.level];

        const primaryMuscles = routine.muscleGroups?.filter(m => !['cardio', 'core'].includes(m)) || [];

        return (
            <div
                key={routine.id}
                className={`
          bg-zinc-800/60 rounded-xl border overflow-hidden
          transition-all duration-200
          ${routine.isFavorite ? 'border-amber-500/30' : 'border-zinc-700/50'}
        `}
            >
                {/* Main card content */}
                <div
                    className="p-4 cursor-pointer hover:bg-zinc-800/80 transition-colors"
                    onClick={() => onSelect?.(routine)}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            {/* Title and favorite */}
                            <div className="flex items-center gap-2 mb-1">
                                {routine.isFavorite && (
                                    <span className="text-amber-400">⭐</span>
                                )}
                                <h4 className="font-semibold text-white truncate">
                                    {routine.routineName}
                                </h4>
                                {routine.isAIGenerated && (
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                                        AI
                                    </span>
                                )}
                            </div>

                            {/* Muscle icons and stats */}
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                    {primaryMuscles.slice(0, 2).map(m => (
                                        <span key={m} className="text-base">{MUSCLE_GROUPS[m]?.icon}</span>
                                    ))}
                                </div>

                                <span className="text-zinc-500">•</span>

                                <span className="text-zinc-400">{routine.totalTime} min</span>

                                <span className="text-zinc-500">•</span>

                                <span className="text-zinc-400">{routine.totalExercises} exercises</span>
                            </div>

                            {/* Level indicator */}
                            {levelData && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map((dot) => (
                                            <div
                                                key={dot}
                                                className={`w-1.5 h-1.5 rounded-full ${dot <= levelData.dots
                                                        ? levelData.colorClasses.text.replace('text-', 'bg-')
                                                        : 'bg-zinc-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs ${levelData.colorClasses.text}`}>
                                        {levelData.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Expand button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(isExpanded ? null : routine.id);
                            }}
                            className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg
                                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Expanded actions */}
                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-zinc-700/50">
                        {isDeleting ? (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-red-400">Delete this routine?</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="px-3 py-1.5 text-sm bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(routine.id)}
                                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect?.(routine);
                                    }}
                                    className="flex-1 min-w-[100px] px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1"
                                >
                                    <span>▶️</span> Start
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite?.(routine.id);
                                    }}
                                    className="px-3 py-2 text-sm bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    {routine.isFavorite ? '⭐' : '☆'}
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDuplicate?.(routine.id);
                                    }}
                                    className="px-3 py-2 text-sm bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    📋
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmId(routine.id);
                                    }}
                                    className="px-3 py-2 text-sm bg-zinc-700 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>
                        )}

                        {/* Last used info */}
                        {routine.lastUsedAt && (
                            <p className="text-zinc-500 text-xs mt-2">
                                Last used: {new Date(routine.lastUsedAt).toLocaleDateString()}
                                {routine.usageCount > 0 && ` • Used ${routine.usageCount} times`}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Favorites section */}
            {favorites.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-zinc-400 text-xs uppercase tracking-wider font-medium px-1 flex items-center gap-2">
                        <span>⭐</span> Favorites
                    </h4>
                    <div className="space-y-2">
                        {favorites.map(renderRoutineCard)}
                    </div>
                </div>
            )}

            {/* Regular routines */}
            {regular.length > 0 && (
                <div className="space-y-2">
                    {favorites.length > 0 && (
                        <h4 className="text-zinc-400 text-xs uppercase tracking-wider font-medium px-1">
                            All Routines
                        </h4>
                    )}
                    <div className="space-y-2">
                        {regular.map(renderRoutineCard)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SavedRoutinesList;
