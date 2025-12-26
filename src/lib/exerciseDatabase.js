/**
 * Exercise Database
 * Customized for your gym equipment:
 * - Leg press machine, Hack squat machine, Leg extension/curl machines
 * - Smith machine, Cable crossover/cables
 * - Flat/Incline/Decline bench, Dumbbells, Barbells, Kettlebells
 * - Preacher curl bench, Step-up platform
 * - Treadmill, Bike, Rowing machine
 */

import { MUSCLE_GROUPS, EXERCISE_TYPES } from './fitnessConstants';

// ═══════════════════════════════════════════════════════════════════════════
// AVAILABLE EQUIPMENT IN YOUR GYM (No bikes)
// ═══════════════════════════════════════════════════════════════════════════
export const AVAILABLE_EQUIPMENT = [
    'barbell',
    'dumbbells',
    'kettlebell',
    'cables',
    'smith_machine',
    'leg_press',
    'hack_squat',
    'leg_extension',
    'leg_curl',
    'preacher_bench',
    'flat_bench',
    'incline_bench',
    'decline_bench',
    'step_platform',
    'treadmill',
    'rower',
    'bodyweight'
];

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE DATABASE - FILTERED FOR YOUR GYM
// ═══════════════════════════════════════════════════════════════════════════

export const EXERCISE_DATABASE = [
    // ─────────────────────────────────────────────────────────────────────────
    // CHEST EXERCISES
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'barbell_bench_press',
        name: 'Barbell Bench Press',
        type: 'primaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'smith_bench_press',
        name: 'Smith Machine Bench Press',
        type: 'primaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'smith_machine',
        movementPattern: 'push'
    },
    {
        id: 'incline_barbell_press',
        name: 'Incline Barbell Press',
        type: 'secondaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'shoulders',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'incline_db_press',
        name: 'Incline Dumbbell Press',
        type: 'secondaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'shoulders',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'dumbbell_bench_press',
        name: 'Dumbbell Bench Press',
        type: 'primaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'decline_bench_press',
        name: 'Decline Bench Press',
        type: 'secondaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'arms',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'decline_db_press',
        name: 'Decline Dumbbell Press',
        type: 'secondaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'arms',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'cable_fly',
        name: 'Cable Fly',
        type: 'heavyIsolation',
        primaryMuscle: 'chest',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'cable_crossover',
        name: 'Cable Crossover',
        type: 'heavyIsolation',
        primaryMuscle: 'chest',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'incline_cable_fly',
        name: 'Incline Cable Fly',
        type: 'heavyIsolation',
        primaryMuscle: 'chest',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'dumbbell_fly',
        name: 'Dumbbell Fly',
        type: 'heavyIsolation',
        primaryMuscle: 'chest',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'push_ups',
        name: 'Push-ups',
        type: 'secondaryCompound',
        primaryMuscle: 'chest',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'push'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // BACK EXERCISES
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'barbell_row',
        name: 'Barbell Bent-Over Row',
        type: 'primaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'pull'
    },
    {
        id: 'dumbbell_row',
        name: 'Single Arm Dumbbell Row',
        type: 'primaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'pull',
        isUnilateral: true
    },
    {
        id: 'deadlift',
        name: 'Barbell Deadlift',
        type: 'primaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'pull'
    },
    {
        id: 'cable_row',
        name: 'Seated Cable Row',
        type: 'primaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 'lat_pulldown',
        name: 'Cable Lat Pulldown',
        type: 'primaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 'close_grip_pulldown',
        name: 'Close Grip Lat Pulldown',
        type: 'secondaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 'face_pulls',
        name: 'Cable Face Pulls',
        type: 'lightIsolation',
        primaryMuscle: 'back',
        secondaryMuscle: 'shoulders',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 'straight_arm_pulldown',
        name: 'Straight Arm Pulldown',
        type: 'heavyIsolation',
        primaryMuscle: 'back',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 't_bar_row',
        name: 'T-Bar Row',
        type: 'secondaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'pull'
    },
    {
        id: 'smith_row',
        name: 'Smith Machine Row',
        type: 'secondaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'smith_machine',
        movementPattern: 'pull'
    },
    {
        id: 'kettlebell_row',
        name: 'Kettlebell Row',
        type: 'secondaryCompound',
        primaryMuscle: 'back',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'kettlebell',
        movementPattern: 'pull',
        isUnilateral: true
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SHOULDER EXERCISES
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'overhead_press',
        name: 'Barbell Overhead Press',
        type: 'primaryCompound',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'db_shoulder_press',
        name: 'Dumbbell Shoulder Press',
        type: 'primaryCompound',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'smith_shoulder_press',
        name: 'Smith Machine Shoulder Press',
        type: 'primaryCompound',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'smith_machine',
        movementPattern: 'push'
    },
    {
        id: 'lateral_raise',
        name: 'Dumbbell Lateral Raise',
        type: 'heavyIsolation',
        primaryMuscle: 'shoulders',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'cable_lateral_raise',
        name: 'Cable Lateral Raise',
        type: 'heavyIsolation',
        primaryMuscle: 'shoulders',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'front_raise',
        name: 'Dumbbell Front Raise',
        type: 'lightIsolation',
        primaryMuscle: 'shoulders',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'cable_front_raise',
        name: 'Cable Front Raise',
        type: 'lightIsolation',
        primaryMuscle: 'shoulders',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'rear_delt_fly',
        name: 'Dumbbell Rear Delt Fly',
        type: 'heavyIsolation',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'back',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'pull'
    },
    {
        id: 'cable_rear_delt',
        name: 'Cable Rear Delt Fly',
        type: 'heavyIsolation',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'back',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 'arnold_press',
        name: 'Arnold Press',
        type: 'secondaryCompound',
        primaryMuscle: 'shoulders',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'upright_row',
        name: 'Barbell Upright Row',
        type: 'secondaryCompound',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'arms',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'pull'
    },
    {
        id: 'kettlebell_press',
        name: 'Kettlebell Shoulder Press',
        type: 'secondaryCompound',
        primaryMuscle: 'shoulders',
        secondaryMuscle: 'arms',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'kettlebell',
        movementPattern: 'push'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ARM EXERCISES (Biceps & Triceps)
    // ─────────────────────────────────────────────────────────────────────────
    // BICEPS (Pull pattern)
    {
        id: 'barbell_curl',
        name: 'Barbell Curl',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'barbell',
        movementPattern: 'pull'
    },
    {
        id: 'dumbbell_curl',
        name: 'Dumbbell Curl',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'pull'
    },
    {
        id: 'hammer_curl',
        name: 'Hammer Curls',
        type: 'lightIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'pull'
    },
    {
        id: 'preacher_curl',
        name: 'Preacher Curl',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'preacher_bench',
        movementPattern: 'pull'
    },
    {
        id: 'cable_curl',
        name: 'Cable Bicep Curl',
        type: 'lightIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'pull'
    },
    {
        id: 'concentration_curl',
        name: 'Concentration Curl',
        type: 'lightIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'pull',
        isUnilateral: true
    },
    {
        id: 'incline_curl',
        name: 'Incline Dumbbell Curl',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'dumbbells',
        movementPattern: 'pull'
    },

    // TRICEPS (Push pattern)
    {
        id: 'tricep_pushdown',
        name: 'Tricep Rope Pushdown',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'tricep_bar_pushdown',
        name: 'Tricep Bar Pushdown',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'overhead_cable_ext',
        name: 'Overhead Cable Extension',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'push'
    },
    {
        id: 'skull_crushers',
        name: 'Skull Crushers',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'overhead_tricep_ext',
        name: 'Overhead Dumbbell Tricep Extension',
        type: 'heavyIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'close_grip_bench',
        name: 'Close Grip Bench Press',
        type: 'secondaryCompound',
        primaryMuscle: 'arms',
        secondaryMuscle: 'chest',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'tricep_kickback',
        name: 'Dumbbell Tricep Kickback',
        type: 'lightIsolation',
        primaryMuscle: 'arms',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push',
        isUnilateral: true
    },
    {
        id: 'diamond_pushup',
        name: 'Diamond Push-ups',
        type: 'secondaryCompound',
        primaryMuscle: 'arms',
        secondaryMuscle: 'chest',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'push'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // LEG EXERCISES
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'barbell_squat',
        name: 'Barbell Back Squat',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: 'core',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'push'
    },
    {
        id: 'smith_squat',
        name: 'Smith Machine Squat',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: 'core',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'smith_machine',
        movementPattern: 'push'
    },
    {
        id: 'goblet_squat',
        name: 'Goblet Squat',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push'
    },
    {
        id: 'kettlebell_squat',
        name: 'Kettlebell Squat',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'kettlebell',
        movementPattern: 'push'
    },
    {
        id: 'leg_press',
        name: 'Leg Press',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'leg_press',
        movementPattern: 'push'
    },
    {
        id: 'hack_squat',
        name: 'Hack Squat',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'hack_squat',
        movementPattern: 'push'
    },
    {
        id: 'romanian_deadlift',
        name: 'Romanian Deadlift',
        type: 'primaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: 'back',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'barbell',
        movementPattern: 'pull'
    },
    {
        id: 'dumbbell_rdl',
        name: 'Dumbbell Romanian Deadlift',
        type: 'secondaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: 'back',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'pull'
    },
    {
        id: 'lunges',
        name: 'Walking Lunges',
        type: 'secondaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push',
        isUnilateral: true
    },
    {
        id: 'reverse_lunges',
        name: 'Reverse Lunges',
        type: 'secondaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'dumbbells',
        movementPattern: 'push',
        isUnilateral: true
    },
    {
        id: 'step_ups',
        name: 'Step-ups',
        type: 'secondaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'step_platform',
        movementPattern: 'push',
        isUnilateral: true
    },
    {
        id: 'bulgarian_split_squat',
        name: 'Bulgarian Split Squat',
        type: 'secondaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'dumbbells',
        movementPattern: 'push',
        isUnilateral: true
    },
    {
        id: 'leg_extension',
        name: 'Leg Extension',
        type: 'heavyIsolation',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'leg_extension',
        movementPattern: 'push'
    },
    {
        id: 'leg_curl',
        name: 'Lying Leg Curl',
        type: 'heavyIsolation',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'leg_curl',
        movementPattern: 'pull'
    },
    {
        id: 'cable_kickback',
        name: 'Cable Glute Kickback',
        type: 'lightIsolation',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'push',
        isUnilateral: true
    },
    {
        id: 'calf_raise_smith',
        name: 'Smith Machine Calf Raise',
        type: 'lightIsolation',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'smith_machine',
        movementPattern: 'push'
    },
    {
        id: 'calf_raise_leg_press',
        name: 'Leg Press Calf Raise',
        type: 'lightIsolation',
        primaryMuscle: 'legs',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'leg_press',
        movementPattern: 'push'
    },
    {
        id: 'kettlebell_swing',
        name: 'Kettlebell Swing',
        type: 'secondaryCompound',
        primaryMuscle: 'legs',
        secondaryMuscle: 'back',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'kettlebell',
        movementPattern: 'pull'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // CORE EXERCISES (Expanded)
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'plank',
        name: 'Plank',
        type: 'isometricCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'side_plank',
        name: 'Side Plank',
        type: 'isometricCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'hollow_hold',
        name: 'Hollow Body Hold',
        type: 'isometricCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'cable_crunch',
        name: 'Cable Crunch',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'neutral'
    },
    {
        id: 'cable_woodchop',
        name: 'Cable Woodchop',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'cables',
        movementPattern: 'neutral'
    },
    {
        id: 'pallof_press',
        name: 'Pallof Press',
        type: 'isometricCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'cables',
        movementPattern: 'neutral'
    },
    {
        id: 'russian_twist',
        name: 'Russian Twist',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'bicycle_crunch',
        name: 'Bicycle Crunch',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'dead_bug',
        name: 'Dead Bug',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'bird_dog',
        name: 'Bird Dog',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'mountain_climbers',
        name: 'Mountain Climbers',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'leg_raise',
        name: 'Lying Leg Raise',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'v_ups',
        name: 'V-ups',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'flutter_kicks',
        name: 'Flutter Kicks',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'reverse_crunch',
        name: 'Reverse Crunch',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'toe_touches',
        name: 'Toe Touches',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'bear_crawl',
        name: 'Bear Crawl',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: 'shoulders',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'neutral'
    },
    {
        id: 'kettlebell_windmill',
        name: 'Kettlebell Windmill',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: 'shoulders',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'kettlebell',
        movementPattern: 'neutral'
    },
    {
        id: 'kettlebell_turkish_getup',
        name: 'Turkish Get-up',
        type: 'dynamicCore',
        primaryMuscle: 'core',
        secondaryMuscle: 'shoulders',
        allowedLevels: ['advanced'],
        isSafeForBeginners: false,
        equipment: 'kettlebell',
        movementPattern: 'neutral'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // CARDIO EXERCISES (No Bikes - Only Treadmill, Rower, Bodyweight)
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'treadmill_run',
        name: 'Treadmill Running',
        type: 'steadyState',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'incline_walking',
        name: 'Incline Walking',
        type: 'steadyState',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'treadmill_power_walk',
        name: 'Power Walk',
        type: 'steadyState',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'treadmill_jog',
        name: 'Treadmill Jogging',
        type: 'steadyState',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'rowing_machine',
        name: 'Rowing Machine',
        type: 'steadyState',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'back',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'rower',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'hiit_sprints',
        name: 'HIIT Sprints',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'treadmill_intervals',
        name: 'Treadmill Intervals',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'incline_intervals',
        name: 'Incline Intervals',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'treadmill',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'rowing_intervals',
        name: 'Rowing Intervals',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'back',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'rower',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'burpees',
        name: 'Burpees',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'core',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'jumping_jacks',
        name: 'Jumping Jacks',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: null,
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'high_knees',
        name: 'High Knees',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'core',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'bodyweight',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'squat_jumps',
        name: 'Squat Jumps',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'neutral',
        isHighImpact: true
    },
    {
        id: 'box_jumps_step',
        name: 'Box Step-ups (Fast)',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['beginner', 'moderate', 'advanced'],
        isSafeForBeginners: true,
        equipment: 'step_platform',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'kettlebell_swings_cardio',
        name: 'Kettlebell Swings (Cardio)',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'kettlebell',
        movementPattern: 'neutral',
        isHighImpact: false
    },
    {
        id: 'skater_jumps',
        name: 'Skater Jumps',
        type: 'hiit',
        primaryMuscle: 'cardio',
        secondaryMuscle: 'legs',
        allowedLevels: ['moderate', 'advanced'],
        isSafeForBeginners: false,
        equipment: 'bodyweight',
        movementPattern: 'neutral',
        isHighImpact: true
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get exercises filtered by muscle group
 */
export function getExercisesByMuscle(muscleGroup) {
    return EXERCISE_DATABASE.filter(ex => ex.primaryMuscle === muscleGroup);
}

/**
 * Get exercises filtered by level
 */
export function getExercisesByLevel(level) {
    return EXERCISE_DATABASE.filter(ex => ex.allowedLevels.includes(level));
}

/**
 * Get exercises safe for beginners
 */
export function getBeginnerSafeExercises() {
    return EXERCISE_DATABASE.filter(ex => ex.isSafeForBeginners);
}

/**
 * Get exercises by type (compound/isolation)
 */
export function getExercisesByType(type) {
    return EXERCISE_DATABASE.filter(ex => ex.type === type);
}

/**
 * Get low-impact cardio options (for legs + cardio combo)
 */
export function getLowImpactCardio() {
    return EXERCISE_DATABASE.filter(ex =>
        ex.primaryMuscle === 'cardio' &&
        ex.isHighImpact === false
    );
}

/**
 * Get exercises for a specific muscle group and level
 */
export function getFilteredExercises(muscleGroup, level) {
    return EXERCISE_DATABASE.filter(ex =>
        ex.primaryMuscle === muscleGroup &&
        ex.allowedLevels.includes(level) &&
        (level !== 'beginner' || ex.isSafeForBeginners)
    );
}
