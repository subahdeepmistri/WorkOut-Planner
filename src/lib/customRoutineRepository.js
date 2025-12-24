/**
 * Custom Routine Repository
 * Handles localStorage persistence for AI-generated custom routines
 * Follows existing WorkoutRepository pattern for consistency
 */

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
    MILES_ROUTINES: 'spideylift_custom_routines_v1',
    GWEN_ROUTINES: 'spideylift_custom_routines_v1_gwen',
    SCHEMA_VERSION: 'spideylift_routine_schema_version'
};

/**
 * Get the correct storage key based on active profile
 */
function getStorageKey(profile) {
    return profile === 'gwen' ? STORAGE_KEYS.GWEN_ROUTINES : STORAGE_KEYS.MILES_ROUTINES;
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class RoutineStorageError extends Error {
    constructor(code, message = null) {
        const defaultMessages = {
            NOT_FOUND: 'Routine not found',
            DUPLICATE_ID: 'A routine with this ID already exists',
            SAVE_FAILED: 'Failed to save routine',
            UPDATE_FAILED: 'Failed to update routine',
            DELETE_FAILED: 'Failed to delete routine',
            DUPLICATE_FAILED: 'Failed to duplicate routine',
            READ_FAILED: 'Failed to read routines',
            STORAGE_FULL: 'Storage limit reached',
            VALIDATION_FAILED: 'Routine validation failed',
            QUOTA_EXCEEDED: 'Browser storage quota exceeded'
        };

        super(message || defaultMessages[code] || 'Unknown error');
        this.code = code;
        this.name = 'RoutineStorageError';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// REPOSITORY CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class CustomRoutineRepository {
    static SCHEMA_VERSION = 1;
    static MAX_ROUTINES = 50;

    // ─────────────────────────────────────────────────────────────────────────
    // CRUD: CREATE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Save a new routine to localStorage
     * @param {Object} routine - The routine object to save
     * @param {string} profile - 'miles' or 'gwen'
     * @returns {{ success: boolean, data?: Object, error?: RoutineStorageError }}
     */
    static saveRoutine(routine, profile = 'miles') {
        try {
            // Validate
            const validation = this.validateRoutine(routine);
            if (!validation.valid) {
                return { success: false, error: new RoutineStorageError('VALIDATION_FAILED', validation.errors.join(', ')) };
            }

            // Check limits
            const routines = this.getAllRoutines(profile);
            if (routines.length >= this.MAX_ROUTINES) {
                return { success: false, error: new RoutineStorageError('STORAGE_FULL', `Maximum ${this.MAX_ROUTINES} routines reached`) };
            }

            // Generate ID if not present
            if (!routine.id) {
                routine.id = this.generateId();
            }

            // Check for duplicate
            if (routines.some(r => r.id === routine.id)) {
                return { success: false, error: new RoutineStorageError('DUPLICATE_ID') };
            }

            // Set timestamps and metadata
            const now = new Date().toISOString();
            const completeRoutine = {
                ...routine,
                createdAt: routine.createdAt || now,
                updatedAt: now,
                lastUsedAt: null,
                usageCount: 0,
                isFavorite: routine.isFavorite || false,
                isArchived: false,
                version: this.SCHEMA_VERSION
            };

            // Save
            routines.push(completeRoutine);
            this.persistRoutines(routines, profile);

            return { success: true, data: completeRoutine };

        } catch (error) {
            console.error('[CustomRoutineRepository] Save failed:', error);
            return { success: false, error: new RoutineStorageError('SAVE_FAILED', error.message) };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CRUD: READ
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get a single routine by ID
     */
    static getRoutine(id, profile = 'miles') {
        try {
            const routines = this.getAllRoutines(profile);
            const routine = routines.find(r => r.id === id && !r.isArchived);

            if (!routine) {
                return { success: false, error: new RoutineStorageError('NOT_FOUND') };
            }

            return { success: true, data: routine };
        } catch (error) {
            return { success: false, error: new RoutineStorageError('READ_FAILED', error.message) };
        }
    }

    /**
     * Get all routines (excluding archived)
     */
    static getAllRoutines(profile = 'miles') {
        try {
            const key = getStorageKey(profile);
            const raw = localStorage.getItem(key);

            if (!raw) return [];

            const routines = JSON.parse(raw);

            // Filter out archived and apply migrations
            return routines
                .filter(r => !r.isArchived)
                .map(r => this.migrateIfNeeded(r));

        } catch (error) {
            console.error('[CustomRoutineRepository] Failed to load routines:', error);
            return [];
        }
    }

    /**
     * Get routines sorted by various criteria
     */
    static getRoutinesSorted(profile = 'miles', sortBy = 'createdAt', order = 'desc') {
        const routines = this.getAllRoutines(profile);

        const sortFns = {
            createdAt: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            updatedAt: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
            lastUsedAt: (a, b) => {
                if (!a.lastUsedAt) return 1;
                if (!b.lastUsedAt) return -1;
                return new Date(b.lastUsedAt) - new Date(a.lastUsedAt);
            },
            usageCount: (a, b) => b.usageCount - a.usageCount,
            routineName: (a, b) => a.routineName.localeCompare(b.routineName),
            totalTime: (a, b) => a.totalTime - b.totalTime
        };

        const sorted = [...routines].sort(sortFns[sortBy] || sortFns.createdAt);
        return order === 'asc' ? sorted.reverse() : sorted;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CRUD: UPDATE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Update an existing routine
     */
    static updateRoutine(id, updates, profile = 'miles') {
        try {
            const routines = this.getAllRoutines(profile);
            const index = routines.findIndex(r => r.id === id);

            if (index === -1) {
                return { success: false, error: new RoutineStorageError('NOT_FOUND') };
            }

            // Merge updates (protect critical fields)
            const updated = {
                ...routines[index],
                ...updates,
                id: routines[index].id,
                createdAt: routines[index].createdAt,
                updatedAt: new Date().toISOString()
            };

            // Validate
            const validation = this.validateRoutine(updated);
            if (!validation.valid) {
                return { success: false, error: new RoutineStorageError('VALIDATION_FAILED', validation.errors.join(', ')) };
            }

            routines[index] = updated;
            this.persistRoutines(routines, profile);

            return { success: true, data: updated };

        } catch (error) {
            return { success: false, error: new RoutineStorageError('UPDATE_FAILED', error.message) };
        }
    }

    /**
     * Record when a routine is used (for tracking)
     */
    static recordUsage(id, profile = 'miles') {
        const result = this.getRoutine(id, profile);
        if (!result.success) return result;

        return this.updateRoutine(id, {
            lastUsedAt: new Date().toISOString(),
            usageCount: (result.data.usageCount || 0) + 1
        }, profile);
    }

    /**
     * Toggle favorite status
     */
    static toggleFavorite(id, profile = 'miles') {
        const result = this.getRoutine(id, profile);
        if (!result.success) return result;

        return this.updateRoutine(id, {
            isFavorite: !result.data.isFavorite
        }, profile);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CRUD: DELETE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Delete a routine (soft delete by default)
     */
    static deleteRoutine(id, profile = 'miles', hard = false) {
        try {
            let routines = this.getAllRoutines(profile);
            const index = routines.findIndex(r => r.id === id);

            if (index === -1) {
                return { success: false, error: new RoutineStorageError('NOT_FOUND') };
            }

            if (hard) {
                // Hard delete: remove entirely
                routines = routines.filter(r => r.id !== id);
            } else {
                // Soft delete: mark as archived
                routines[index].isArchived = true;
                routines[index].updatedAt = new Date().toISOString();
            }

            this.persistRoutines(routines, profile);
            return { success: true };

        } catch (error) {
            return { success: false, error: new RoutineStorageError('DELETE_FAILED', error.message) };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DUPLICATE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Create a copy of an existing routine
     */
    static duplicateRoutine(id, profile = 'miles') {
        try {
            const result = this.getRoutine(id, profile);
            if (!result.success) return result;

            const original = result.data;

            // Create deep clone with new ID and modified name
            const duplicate = {
                ...JSON.parse(JSON.stringify(original)),
                id: this.generateId(),
                routineName: `${original.routineName} (Copy)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastUsedAt: null,
                usageCount: 0,
                isFavorite: false
            };

            return this.saveRoutine(duplicate, profile);

        } catch (error) {
            return { success: false, error: new RoutineStorageError('DUPLICATE_FAILED', error.message) };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UTILITIES
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Check if a routine name already exists
     */
    static routineNameExists(name, profile = 'miles', excludeId = null) {
        const routines = this.getAllRoutines(profile);
        return routines.some(r =>
            r.routineName.toLowerCase() === name.toLowerCase() &&
            r.id !== excludeId
        );
    }

    /**
     * Get favorites
     */
    static getFavorites(profile = 'miles') {
        return this.getAllRoutines(profile).filter(r => r.isFavorite);
    }

    /**
     * Get recently used (last 5)
     */
    static getRecentlyUsed(profile = 'miles') {
        return this.getRoutinesSorted(profile, 'lastUsedAt', 'desc')
            .filter(r => r.lastUsedAt)
            .slice(0, 5);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INTERNAL HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate unique routine ID
     */
    static generateId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `routine_${timestamp}_${random}`;
    }

    /**
     * Validate routine before saving
     */
    static validateRoutine(routine) {
        const errors = [];

        if (!routine.routineName || routine.routineName.trim().length === 0) {
            errors.push('Routine name is required');
        }

        if (routine.routineName && routine.routineName.length > 50) {
            errors.push('Routine name must be 50 characters or less');
        }

        if (!routine.exercises || routine.exercises.length === 0) {
            errors.push('At least one exercise is required');
        }

        if (!routine.muscleGroups || routine.muscleGroups.length === 0) {
            errors.push('At least one muscle group is required');
        }

        if (!routine.level) {
            errors.push('Experience level is required');
        }

        if (routine.totalTime && routine.totalTime > 90) {
            errors.push('Total time exceeds 90 minute limit');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Persist routines to localStorage
     */
    static persistRoutines(routines, profile) {
        const key = getStorageKey(profile);
        try {
            localStorage.setItem(key, JSON.stringify(routines));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                throw new RoutineStorageError('QUOTA_EXCEEDED');
            }
            throw error;
        }
    }

    /**
     * Apply schema migrations if needed
     */
    static migrateIfNeeded(routine) {
        if (!routine.version || routine.version < this.SCHEMA_VERSION) {
            // Apply v1 defaults
            return {
                ...routine,
                version: this.SCHEMA_VERSION,
                isArchived: routine.isArchived ?? false,
                isFavorite: routine.isFavorite ?? false,
                usageCount: routine.usageCount ?? 0,
                lastUsedAt: routine.lastUsedAt ?? null
            };
        }
        return routine;
    }

    /**
     * Clear all routines (use with caution - for testing/reset)
     */
    static clearAllRoutines(profile = 'miles') {
        const key = getStorageKey(profile);
        localStorage.removeItem(key);
    }
}

export default CustomRoutineRepository;
