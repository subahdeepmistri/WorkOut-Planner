import { ExerciseFactory } from './factory';

export const DEFAULT_TEMPLATES = [
    {
        id: 'a1-chest-tri',
        name: 'Week A - Day 1: Chest & Triceps',
        exercises: [
            { name: 'Incline DB Press', sets: 4, reps: 8, weight: 0 },
            { name: 'Barbell Bench Press', sets: 5, reps: 5, weight: 0 },
            { name: 'Weighted Dips', sets: 4, reps: 8, weight: 0 },
            { name: 'Cable Fly (L-to-H)', sets: 3, reps: 15, weight: 0 },
            { name: 'DB Hex Press', sets: 3, reps: 10, weight: 0 },
            { name: 'Skull Crushers', sets: 4, reps: 10, weight: 0 },
            { name: 'Rope Pushdown', sets: 4, reps: 15, weight: 0 },
            { name: 'Bench Dips', sets: 2, reps: 15, weight: 0 },
        ]
    },
    // ... (Add other templates as needed, keeping it minimal for now to save space)
];

export class WorkoutRepository {
    static KEYS = {
        LOGS: 'neonlift_logs',
        TEMPLATES: 'neonlift_templates'
    };

    static getLogs() {
        try {
            const raw = JSON.parse(localStorage.getItem(this.KEYS.LOGS)) || {};
            const hydrated = {};
            Object.keys(raw).forEach(date => {
                hydrated[date] = (raw[date] || []).map(item => ExerciseFactory.create(item));
            });
            return hydrated;
        } catch (e) {
            console.error("Failed to load logs", e);
            return {};
        }
    }

    static saveLogs(logs) {
        this.safeSave(this.KEYS.LOGS, logs);
    }

    static getTemplates() {
        try {
            const saved = localStorage.getItem(this.KEYS.TEMPLATES);
            if (saved === null) return DEFAULT_TEMPLATES;
            return JSON.parse(saved);
        } catch (e) {
            return DEFAULT_TEMPLATES;
        }
    }

    static saveTemplates(templates) {
        this.safeSave(this.KEYS.TEMPLATES, templates);
    }

    static getWorkoutStatuses() {
        try {
            return JSON.parse(localStorage.getItem('spidey_workout_statuses')) || {};
        } catch (e) {
            return {};
        }
    }

    static saveWorkoutStatuses(statuses) {
        try {
            localStorage.setItem('spidey_workout_statuses', JSON.stringify(statuses));
        } catch (e) {
            console.error("Failed to save workout statuses", e);
        }
    }

    static safeSave(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    }
}
