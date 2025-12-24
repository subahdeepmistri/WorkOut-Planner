/**
 * useCustomRoutines Hook
 * React hook for managing custom routines with automatic state sync
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CustomRoutineRepository } from '../lib/customRoutineRepository';

/**
 * Hook for managing custom routines
 * Provides CRUD operations with automatic React state synchronization
 */
export function useCustomRoutines() {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get profile from localStorage (consistent with useWorkoutData pattern)
    const profile = useMemo(() => {
        return localStorage.getItem('spideylift_profile') || 'miles';
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // LOAD ROUTINES
    // ─────────────────────────────────────────────────────────────────────────

    const loadRoutines = useCallback(() => {
        setLoading(true);
        setError(null);

        try {
            const loaded = CustomRoutineRepository.getAllRoutines(profile);
            setRoutines(loaded);
        } catch (err) {
            console.error('[useCustomRoutines] Failed to load:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [profile]);

    // Load on mount and profile change
    useEffect(() => {
        loadRoutines();
    }, [loadRoutines]);

    // Listen for storage changes (sync across tabs)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key?.includes('custom_routines')) {
                loadRoutines();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadRoutines]);

    // ─────────────────────────────────────────────────────────────────────────
    // CRUD OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Save a new routine
     */
    const saveRoutine = useCallback((routine) => {
        const result = CustomRoutineRepository.saveRoutine(routine, profile);

        if (result.success) {
            setRoutines(prev => [...prev, result.data]);
        } else {
            setError(result.error?.message || 'Failed to save routine');
        }

        return result;
    }, [profile]);

    /**
     * Update an existing routine
     */
    const updateRoutine = useCallback((id, updates) => {
        const result = CustomRoutineRepository.updateRoutine(id, updates, profile);

        if (result.success) {
            setRoutines(prev => prev.map(r => r.id === id ? result.data : r));
        } else {
            setError(result.error?.message || 'Failed to update routine');
        }

        return result;
    }, [profile]);

    /**
     * Delete a routine (soft delete by default)
     */
    const deleteRoutine = useCallback((id, hard = false) => {
        const result = CustomRoutineRepository.deleteRoutine(id, profile, hard);

        if (result.success) {
            setRoutines(prev => prev.filter(r => r.id !== id));
        } else {
            setError(result.error?.message || 'Failed to delete routine');
        }

        return result;
    }, [profile]);

    /**
     * Duplicate a routine
     */
    const duplicateRoutine = useCallback((id) => {
        const result = CustomRoutineRepository.duplicateRoutine(id, profile);

        if (result.success) {
            setRoutines(prev => [...prev, result.data]);
        } else {
            setError(result.error?.message || 'Failed to duplicate routine');
        }

        return result;
    }, [profile]);

    /**
     * Toggle favorite status
     */
    const toggleFavorite = useCallback((id) => {
        const result = CustomRoutineRepository.toggleFavorite(id, profile);

        if (result.success) {
            setRoutines(prev => prev.map(r =>
                r.id === id ? { ...r, isFavorite: result.data.isFavorite } : r
            ));
        }

        return result;
    }, [profile]);

    /**
     * Record routine usage
     */
    const recordUsage = useCallback((id) => {
        const result = CustomRoutineRepository.recordUsage(id, profile);

        if (result.success) {
            setRoutines(prev => prev.map(r =>
                r.id === id ? result.data : r
            ));
        }

        return result;
    }, [profile]);

    // ─────────────────────────────────────────────────────────────────────────
    // COMPUTED VALUES
    // ─────────────────────────────────────────────────────────────────────────

    const favorites = useMemo(() => {
        return routines.filter(r => r.isFavorite);
    }, [routines]);

    const recentlyUsed = useMemo(() => {
        return routines
            .filter(r => r.lastUsedAt)
            .sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt))
            .slice(0, 5);
    }, [routines]);

    const routineCount = useMemo(() => routines.length, [routines]);

    // ─────────────────────────────────────────────────────────────────────────
    // UTILITY FUNCTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get a single routine by ID
     */
    const getRoutineById = useCallback((id) => {
        return routines.find(r => r.id === id) || null;
    }, [routines]);

    /**
     * Check if a routine name exists
     */
    const routineNameExists = useCallback((name, excludeId = null) => {
        return routines.some(r =>
            r.routineName.toLowerCase() === name.toLowerCase() &&
            r.id !== excludeId
        );
    }, [routines]);

    /**
     * Get routines sorted by criteria
     */
    const getRoutinesSorted = useCallback((sortBy = 'createdAt', order = 'desc') => {
        const sortFns = {
            createdAt: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            routineName: (a, b) => a.routineName.localeCompare(b.routineName),
            totalTime: (a, b) => a.totalTime - b.totalTime,
            usageCount: (a, b) => b.usageCount - a.usageCount
        };

        const sorted = [...routines].sort(sortFns[sortBy] || sortFns.createdAt);
        return order === 'asc' ? sorted.reverse() : sorted;
    }, [routines]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // RETURN VALUE
    // ─────────────────────────────────────────────────────────────────────────

    return {
        // State
        routines,
        loading,
        error,

        // CRUD Operations
        saveRoutine,
        updateRoutine,
        deleteRoutine,
        duplicateRoutine,
        toggleFavorite,
        recordUsage,

        // Computed
        favorites,
        recentlyUsed,
        routineCount,

        // Utilities
        getRoutineById,
        routineNameExists,
        getRoutinesSorted,
        refresh: loadRoutines,
        clearError
    };
}

export default useCustomRoutines;
