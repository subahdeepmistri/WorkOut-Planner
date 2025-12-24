import { useState, useEffect, useCallback } from 'react';

// Default Workout Plans Data - Updated with Antagonist Alpha Protocol
export const WORKOUT_PLANS = [
    {
        id: 'week_a_day_1', name: "Chest + Abs",
        exercises: [
            { name: "Barbell Bench Press", targetSets: 5, targetReps: "5" },
            { name: "Incline DB Press", targetSets: 4, targetReps: "8-10" },
            { name: "Weighted Dips", targetSets: 4, targetReps: "8-12" },
            { name: "Incline Cable Fly", targetSets: 3, targetReps: "12-15" },
            { name: "Plate Press (Svend)", targetSets: 3, targetReps: "15" },
            { name: "Cable Chest Press", targetSets: 3, targetReps: "10 + Drop" },
            { name: "Deficit Push-Ups", targetSets: 2, targetReps: "Failure" },
            { name: "Hanging Leg Raises", targetSets: 3, targetReps: "12-15", type: 'abs' },
            { name: "Cable Rope Crunch", targetSets: 4, targetReps: "15-20", type: 'abs' }
        ]
    },
    {
        id: 'week_a_day_2', name: "Back + HIIT",
        exercises: [
            { name: "Deadlift", targetSets: 4, targetReps: "5" },
            { name: "Weighted Pull-Ups", targetSets: 4, targetReps: "6-8" },
            { name: "T-Bar Row (Chest Supported)", targetSets: 4, targetReps: "10-12" },
            { name: "Single-Arm DB Row", targetSets: 3, targetReps: "10" },
            { name: "Lat Pulldown", targetSets: 3, targetReps: "12-15" },
            { name: "Straight-Arm Pulldown", targetSets: 3, targetReps: "15" },
            { name: "Face Pulls", targetSets: 4, targetReps: "15-20" },
            { name: "HIIT Finisher (Sprints)", targetSets: 12, targetReps: "20s/40s", type: 'cardio', defaultMode: 'circuit' }
        ]
    },
    {
        id: 'week_a_day_3', name: "Legs",
        exercises: [
            { name: "Barbell Back Squat", targetSets: 5, targetReps: "5" },
            { name: "Bulgarian Split Squat", targetSets: 3, targetReps: "8-10" },
            { name: "Romanian Deadlift", targetSets: 4, targetReps: "8-10" },
            { name: "Leg Press (Close Stance)", targetSets: 4, targetReps: "12-15" },
            { name: "Leg Extension", targetSets: 3, targetReps: "15 + Drop" },
            { name: "Lying Leg Curl", targetSets: 4, targetReps: "12" },
            { name: "Standing Calf Raise", targetSets: 4, targetReps: "15-20" },
            { name: "Alternating Reverse Lunges", targetSets: 2, targetReps: "50 Total" }
        ]
    },
    {
        id: 'week_a_day_4', name: "Shoulders",
        exercises: [
            { name: "Overhead Press", targetSets: 5, targetReps: "5" },
            { name: "Seated DB Press", targetSets: 4, targetReps: "8-10" },
            { name: "DB Lateral Raises", targetSets: 4, targetReps: "15-20" },
            { name: "Cable Lateral Raise", targetSets: 3, targetReps: "12" },
            { name: "Reverse Pec Deck", targetSets: 4, targetReps: "15" },
            { name: "Arnold Press", targetSets: 3, targetReps: "10-12" },
            { name: "Barbell Shrugs", targetSets: 4, targetReps: "12-15" },
            { name: "Cardio (Fast Walk/Cycle)", targetSets: 1, targetReps: "20 Mins", type: 'cardio', defaultMode: 'distance' }
        ]
    },
    {
        id: 'week_a_day_5', name: "Arms",
        exercises: [
            { name: "Barbell Curl", targetSets: 4, targetReps: "8-10" },
            { name: "Close-Grip Bench Press", targetSets: 4, targetReps: "8-10" },
            { name: "Incline DB Curl", targetSets: 3, targetReps: "10-12" },
            { name: "Skull Crushers", targetSets: 3, targetReps: "10-12" },
            { name: "Hammer Curls", targetSets: 3, targetReps: "12-15" },
            { name: "Rope Pushdown", targetSets: 3, targetReps: "12-15" },
            { name: "Preacher Curl", targetSets: 3, targetReps: "12" },
            { name: "Overhead DB Extension", targetSets: 3, targetReps: "12" },
            { name: "Reverse Grip Curl", targetSets: 3, targetReps: "15" },
            { name: "Wrist Curls", targetSets: 3, targetReps: "20" }
        ]
    },
    {
        id: 'week_a_day_6', name: "Full Body",
        exercises: [
            { name: "Front Squat", targetSets: 4, targetReps: "6-8" },
            { name: "Pull-Ups", targetSets: 3, targetReps: "Failure" },
            { name: "Incline DB Press", targetSets: 3, targetReps: "10" },
            { name: "DB Reverse Lunges", targetSets: 3, targetReps: "12/leg" },
            { name: "Dumbbell Swings", targetSets: 4, targetReps: "20" },
            { name: "Metcon Circuit", targetSets: 3, targetReps: "Rounds", type: 'cardio', defaultMode: 'circuit' },
            { name: "Plank Variations", targetSets: 3, targetReps: "60", type: 'abs' }
        ]
    },
    {
        id: 'week_b_day_1', name: "Chest & Back",
        exercises: [
            { name: "Incline Barbell Bench Press", targetSets: 4, targetReps: "5-7" },
            { name: "Weighted Wide Pull-Ups", targetSets: 4, targetReps: "5-7" },
            { name: "Flat Dumbbell Press", targetSets: 3, targetReps: "8-10" },
            { name: "Bent Over Barbell Row", targetSets: 3, targetReps: "8-10" },
            { name: "Incline DB Hex Press", targetSets: 3, targetReps: "10-12" },
            { name: "Single Arm Lat Pulldown", targetSets: 3, targetReps: "12-15" },
            { name: "Dumbbell Pullovers", targetSets: 3, targetReps: "15" }
        ]
    },
    {
        id: 'week_b_day_2', name: "Legs + Abs",
        exercises: [
            { name: "Barbell Back Squat", targetSets: 4, targetReps: "5-8" },
            { name: "Leg Press (Low Stance)", targetSets: 4, targetReps: "10-12" },
            { name: "Bulgarian Split Squats", targetSets: 3, targetReps: "10" },
            { name: "Leg Extensions", targetSets: 4, targetReps: "15-20" },
            { name: "Hanging Leg Raises", targetSets: 4, targetReps: "Failure", type: 'abs' },
            { name: "Cable Woodchoppers", targetSets: 3, targetReps: "15", type: 'abs' },
            { name: "Finisher: Sled Push/Stairs", targetSets: 1, targetReps: "10 Mins", type: 'cardio', defaultMode: 'distance' }
        ]
    },
    {
        id: 'week_b_day_3', name: "Shoulders & Arms",
        exercises: [
            { name: "Standing Military Press", targetSets: 4, targetReps: "6-8" },
            { name: "Close Grip Bench Press", targetSets: 3, targetReps: "6-8" },
            { name: "Barbell Drag Curl", targetSets: 3, targetReps: "8-10" },
            { name: "Seated DB Press", targetSets: 3, targetReps: "8-10" },
            { name: "DB Lateral Raises", targetSets: 3, targetReps: "12-15" },
            { name: "Skullcrushers (EZ Bar)", targetSets: 3, targetReps: "10-12" },
            { name: "Incline DB Curls", targetSets: 3, targetReps: "10-12" }
        ]
    },
    {
        id: 'week_b_day_4', name: "Chest & Back (Volume)",
        exercises: [
            { name: "Incline DB Press (30°)", targetSets: 4, targetReps: "10-12" },
            { name: "Chest Supported Row", targetSets: 4, targetReps: "10-12" },
            { name: "Machine Chest Fly", targetSets: 3, targetReps: "15-20" },
            { name: "Lat Pulldown (Neutral)", targetSets: 3, targetReps: "12-15" },
            { name: "Cable Crossover", targetSets: 3, targetReps: "15+" },
            { name: "Straight Arm Pulldown", targetSets: 3, targetReps: "15+" },
            { name: "Rack Pulls", targetSets: 3, targetReps: "8" }
        ]
    },
    {
        id: 'week_b_day_5', name: "Legs (Heavy)",
        exercises: [
            { name: "Romanian Deadlift (RDL)", targetSets: 4, targetReps: "8-10" },
            { name: "Hip Thrusts", targetSets: 4, targetReps: "10-12" },
            { name: "Seated Leg Curls", targetSets: 4, targetReps: "12-15" },
            { name: "Walking Lunges", targetSets: 3, targetReps: "20" },
            { name: "Standing Calf Raises", targetSets: 4, targetReps: "10-12" },
            { name: "Seated Calf Raises", targetSets: 3, targetReps: "20" }
        ]
    },
    {
        id: 'week_b_day_6', name: "Arms & Pump",
        exercises: [
            { name: "Cable Lateral Raises", targetSets: 4, targetReps: "15-20" },
            { name: "Face Pulls", targetSets: 4, targetReps: "15-20" },
            { name: "Tricep Rope Pushdown", targetSets: 3, targetReps: "15-20" },
            { name: "Hammer Curls", targetSets: 3, targetReps: "12-15" },
            { name: "Dips", targetSets: 3, targetReps: "Failure" },
            { name: "Rear Delt Flyes", targetSets: 3, targetReps: "20" },
            { name: "HIIT Finisher", targetSets: 15, targetReps: "30s/30s", type: 'cardio', defaultMode: 'circuit' }
        ]
    },

];

const HER_WORKOUT_PLANS = [
    // --- WEEK A ---
    {
        id: 'gwen_week_a_day_1', name: "Chest & Abs",
        exercises: [
            { name: "Barbell Bench Press", targetSets: 4, targetReps: "5-6" },
            { name: "Incline Dumbbell Press", targetSets: 4, targetReps: "8-10" },
            { name: "Low-Incline Cable Fly", targetSets: 3, targetReps: "12-15" },
            { name: "Deficit Push-Ups", targetSets: 3, targetReps: "Failure" },
            { name: "Leg Raises", targetSets: 4, targetReps: "12-15", type: 'abs' },
            { name: "Woodchoppers", targetSets: 4, targetReps: "15/side", type: 'abs' },
            { name: "Plank to Push-up", targetSets: 3, targetReps: "45", type: 'abs' },
            { name: "Finisher: Push-ups", targetSets: 1, targetReps: "50 Total" }
        ]
    },
    {
        id: 'gwen_week_a_day_2', name: "Back (Posterior)",
        exercises: [
            { name: "Conventional Deadlift", targetSets: 4, targetReps: "3-5" },
            { name: "Wide Grip Pull-Ups", targetSets: 4, targetReps: "6-8" },
            { name: "Chest-Supported T-Bar Row", targetSets: 4, targetReps: "8-10" },
            { name: "Single-Arm Lat Pulldown", targetSets: 3, targetReps: "10-12" },
            { name: "Straight Arm Rope Pulldown", targetSets: 3, targetReps: "12-15" },
            { name: "Face Pulls", targetSets: 4, targetReps: "15-20" },
            { name: "Weighted Hyperextensions", targetSets: 3, targetReps: "15" },
            { name: "Finisher: Burpees", targetSets: 12, targetReps: "30s/30s", type: 'cardio', defaultMode: 'circuit' }
        ]
    },
    {
        id: 'gwen_week_a_day_3', name: "Legs (Glute/Quad)",
        exercises: [
            { name: "Barbell Hip Thrust", targetSets: 4, targetReps: "8-10" },
            { name: "Heel-Elevated Goblet Squat", targetSets: 4, targetReps: "10-12" },
            { name: "Deficit Reverse Lunges", targetSets: 3, targetReps: "10/leg" },
            { name: "Dumbbell Sumo Squats", targetSets: 4, targetReps: "12-15" },
            { name: "Wide Stance Leg Press", targetSets: 3, targetReps: "12-15" },
            { name: "Leg Extensions (Drop Set)", targetSets: 3, targetReps: "15-20" },
            { name: "Seated Leg Curl", targetSets: 3, targetReps: "12-15" },
            { name: "Calf Raises", targetSets: 4, targetReps: "15-20" },
            { name: "Finisher: Wall Sit", targetSets: 2, targetReps: "Failure" },
            { name: "Finisher: Jump Squats", targetSets: 2, targetReps: "20" }
        ]
    },
    {
        id: 'gwen_week_a_day_4', name: "Shoulders & Core",
        exercises: [
            { name: "Seated DB Overhead Press", targetSets: 4, targetReps: "8-10" },
            { name: "Egyptian Cable Lateral Raise", targetSets: 4, targetReps: "12-15" },
            { name: "Dumbbell Lateral Raises", targetSets: 3, targetReps: "15-20" },
            { name: "Rear Delt Fly", targetSets: 4, targetReps: "15-20" },
            { name: "Plate Front Raise", targetSets: 3, targetReps: "12" },
            { name: "Stomach Vacuums", targetSets: 4, targetReps: "20", type: 'abs' },
            { name: "Finisher: Step-Ups", targetSets: 4, targetReps: "50 Total", type: 'cardio' }
        ]
    },
    {
        id: 'gwen_week_a_day_5', name: "Arms (Supersets)",
        exercises: [
            { name: "Close Grip Bench Press", targetSets: 4, targetReps: "6-8" },
            { name: "Skull Crushers", targetSets: 3, targetReps: "10-12" },
            { name: "EZ Bar Curl", targetSets: 3, targetReps: "10-12" },
            { name: "Tri Pushdown", targetSets: 3, targetReps: "12-15" },
            { name: "Cable Curl", targetSets: 3, targetReps: "12-15" },
            { name: "Overhead Extension", targetSets: 3, targetReps: "12-15" },
            { name: "Hammer Curl", targetSets: 3, targetReps: "12-15" },
            { name: "Reverse Grip Barbell Curl", targetSets: 3, targetReps: "15" },
            { name: "Finisher: 21s Biceps", targetSets: 2, targetReps: "21" },
            { name: "Finisher: Diamond Push-ups", targetSets: 2, targetReps: "Failure" }
        ]
    },
    {
        id: 'gwen_week_a_day_6', name: "Full Body Conditioning",
        exercises: [
            { name: "Clean and Press", targetSets: 4, targetReps: "8" },
            { name: "Kettlebell/DB Swings", targetSets: 4, targetReps: "20" },
            { name: "Circuit: Squats", targetSets: 4, targetReps: "15" },
            { name: "Circuit: Push Ups", targetSets: 4, targetReps: "15" },
            { name: "Circuit: Rows", targetSets: 4, targetReps: "15" },
            { name: "Walking Lunges", targetSets: 3, targetReps: "50 steps" },
            { name: "Battle Ropes", targetSets: 4, targetReps: "30s", type: 'cardio', defaultMode: 'circuit' }
        ]
    },
    // --- WEEK B ---
    {
        id: 'gwen_week_b_day_1', name: "Chest, Tris & Abs",
        exercises: [
            { name: "Barbell Bench Press", targetSets: 4, targetReps: "5-6" },
            { name: "Incline Dumbbell Press", targetSets: 4, targetReps: "8-10" },
            { name: "Cable Fly (High to Low)", targetSets: 3, targetReps: "12-15" },
            { name: "Skull Crushers (EZ Bar)", targetSets: 4, targetReps: "10-12" },
            { name: "Tricep Rope Pushdown", targetSets: 3, targetReps: "12-15" },
            { name: "Overhead DB Extension", targetSets: 3, targetReps: "12-15" },
            { name: "Weighted Plank", targetSets: 3, targetReps: "60", type: 'abs' },
            { name: "Finisher: Treadmill Sprints", targetSets: 10, targetReps: "30s/30s", type: 'cardio', defaultMode: 'circuit' }
        ]
    },
    {
        id: 'gwen_week_b_day_2', name: "Back & Rear Delts",
        exercises: [
            { name: "Conventional Deadlift", targetSets: 4, targetReps: "3-5" },
            { name: "Pull-Ups (or Assisted)", targetSets: 4, targetReps: "6-8" },
            { name: "Single-Arm DB Row", targetSets: 3, targetReps: "10-12" },
            { name: "Seated Cable Row", targetSets: 3, targetReps: "12-15" },
            { name: "Straight Arm Pulldown", targetSets: 3, targetReps: "15-20" },
            { name: "Face Pulls", targetSets: 4, targetReps: "15-20" },
            { name: "Back Extensions", targetSets: 3, targetReps: "15" }
        ]
    },
    {
        id: 'gwen_week_b_day_3', name: "Legs Heavy",
        exercises: [
            { name: "Barbell Back Squat", targetSets: 4, targetReps: "5-8" },
            { name: "Hip Thrusts", targetSets: 4, targetReps: "8-10" },
            { name: "Leg Press (Feet Wide)", targetSets: 4, targetReps: "10-12" },
            { name: "Walking Lunges", targetSets: 3, targetReps: "24 steps" },
            { name: "Dumbbell Sumo Squat", targetSets: 3, targetReps: "15-20" },
            { name: "Leg Extension", targetSets: 3, targetReps: "15-20" },
            { name: "Lying Leg Curl", targetSets: 3, targetReps: "12-15" },
            { name: "Finisher: Walking (Incline)", targetSets: 1, targetReps: "5 mins", type: 'cardio', defaultMode: 'distance' }
        ]
    },
    {
        id: 'gwen_week_b_day_4', name: "Shoulders & Calves",
        exercises: [
            { name: "Overhead Press (Barbell)", targetSets: 4, targetReps: "6-8" },
            { name: "Seated DB Press", targetSets: 3, targetReps: "8-10" },
            { name: "DB Lateral Raises", targetSets: 4, targetReps: "12-15" },
            { name: "Cable Lateral Raises", targetSets: 3, targetReps: "15-20" },
            { name: "Rear Delt Fly (DBs)", targetSets: 3, targetReps: "15-20" },
            { name: "Standing Calf Raises", targetSets: 4, targetReps: "10-12" },
            { name: "Trademill", targetSets: 1, targetReps: "15 Mins", type: 'cardio', defaultMode: 'distance' }
        ]
    },
    {
        id: 'gwen_week_b_day_5', name: "Arms & Abs",
        exercises: [
            { name: "Close Grip Bench (A1)", targetSets: 3, targetReps: "8-10" },
            { name: "Barbell Curls (A2)", targetSets: 3, targetReps: "8-10" },
            { name: "DB Hammer Curls (B1)", targetSets: 3, targetReps: "12" },
            { name: "Cable Tricep Overhead (B2)", targetSets: 3, targetReps: "12" },
            { name: "Concentration Curls (C1)", targetSets: 2, targetReps: "15" },
            { name: "Bench Dips (C2)", targetSets: 2, targetReps: "Failure" },
            { name: "Hanging Leg Raises", targetSets: 3, targetReps: "12-15", type: 'abs' },
            { name: "Russian Twists", targetSets: 3, targetReps: "20", type: 'abs' }
        ]
    },
    {
        id: 'gwen_week_b_day_6', name: "Legs (High Intensity)",
        exercises: [
            { name: "Sumo Goblet Squat", targetSets: 4, targetReps: "12-15" },
            { name: "Reverse Lunges", targetSets: 3, targetReps: "10/side" },
            { name: "Dumbbell Swings", targetSets: 4, targetReps: "20" },
            { name: "Bulgarian Split Squat", targetSets: 3, targetReps: "10/leg" },
            { name: "Heels-Elevated Narrow Squat", targetSets: 3, targetReps: "12-15" },
            { name: "Cable Glute Kickbacks", targetSets: 3, targetReps: "15/leg" },
            { name: "Finisher: BW Squats", targetSets: 5, targetReps: "30s", type: 'cardio', defaultMode: 'circuit' }
        ]
    }
];

/**
 * useWorkoutData Hook
 * Centralizes all business logic for workout management.
 */
export const useWorkoutData = (selectedDate) => {
    const [userProfile, setUserProfile] = useState(() => {
        return localStorage.getItem('spideylift_profile') || 'miles';
    });

    // Helper to get storage keys based on profile
    const getStorageKeys = (profile) => ({
        workoutKey: profile === 'miles' ? 'spideylift_workouts_v3' : 'spideylift_workouts_v3_gwen',
        planKey: profile === 'miles' ? 'spideylift_plans_v1' : 'spideylift_plans_v1_gwen'
    });

    // Initialize state (lazy initializer only runs once, so we need useEffect for switching)
    const [workoutData, setWorkoutData] = useState(() => {
        const { workoutKey } = getStorageKeys(localStorage.getItem('spideylift_profile') || 'miles');
        const saved = localStorage.getItem(workoutKey);
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse workouts:", e);
            return {};
        }
    });

    const [savedPlans, setSavedPlans] = useState(() => {
        const { planKey } = getStorageKeys(localStorage.getItem('spideylift_profile') || 'miles');
        const saved = localStorage.getItem(planKey);
        try {
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse plans:", e);
            return [];
        }
    });

    // Determine available plans based on profile
    const availablePlans = userProfile === 'miles' ? WORKOUT_PLANS : HER_WORKOUT_PLANS;
    const [activePlanId, setActivePlanId] = useState(availablePlans[0].id);

    // Sync active plan and RELOAD data if profile changes
    useEffect(() => {
        // 1. Profile Persistence
        localStorage.setItem('spideylift_profile', userProfile);

        // 2. Reload Data for New Profile
        const { workoutKey, planKey } = getStorageKeys(userProfile);

        const savedWorkouts = localStorage.getItem(workoutKey);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWorkoutData(savedWorkouts ? JSON.parse(savedWorkouts) : {});

        const savedCustomPlans = localStorage.getItem(planKey);
        const loadedPlans = savedCustomPlans ? JSON.parse(savedCustomPlans) : [];
        setSavedPlans(loadedPlans);

        // 3. Reset Active Plan if needed
        const plans = userProfile === 'miles' ? WORKOUT_PLANS : HER_WORKOUT_PLANS;
        // Check if current active plan belongs to the new profile's default OR custom plans
        const isActivePlanValid = plans.find(p => p.id === activePlanId) || loadedPlans.find(p => p.id === activePlanId);

        if (!isActivePlanValid) {
            setActivePlanId(plans[0].id);
        }
    }, [userProfile]);

    const [pendingSuperset, setPendingSuperset] = useState(null);

    // Persistence Effect (Save on Change)
    useEffect(() => {
        const { workoutKey } = getStorageKeys(userProfile);
        localStorage.setItem(workoutKey, JSON.stringify(workoutData));
    }, [workoutData, userProfile]);

    useEffect(() => {
        const { planKey } = getStorageKeys(userProfile);
        localStorage.setItem(planKey, JSON.stringify(savedPlans));
    }, [savedPlans, userProfile]);

    // Derived State
    // FIX: Use local date string (YYYY-MM-DD) to avoid UTC shifting issues
    const dateKey = selectedDate.toLocaleDateString('en-CA');
    const currentLog = workoutData[dateKey];

    // Derived Lock State: Explicitly locked OR Expired (> 24h)
    // FIX: Suppressing purity warning for Date.now() as it is safe for coarse expiration checks
    // eslint-disable-next-line
    const isExpired = currentLog?.endTime && (Date.now() - currentLog.endTime > 86400000);
    const isLocked = currentLog?.isLocked || isExpired || false;

    // Holidays (Tuesday = 2)
    const isHoliday = selectedDate.getDay() === 2;

    // --- Actions ---

    /**
     * Calculates the best weight lifted for a given exercise across all history (excluding today).
     * @param {string} exerciseName 
     * @returns {{weight: number} | null} Max weight found or null.
     */
    const getPreviousBest = useCallback((exerciseName) => {
        let bestWeight = 0;
        const dates = Object.keys(workoutData).sort().reverse();
        for (const d of dates) {
            if (d === dateKey) continue;
            const log = workoutData[d];
            if (!log || !log.exercises) continue;
            const ex = log.exercises.find(e => e.name === exerciseName);
            if (ex) {
                ex.sets.forEach(s => {
                    if (s.completed && s.weight > bestWeight) bestWeight = s.weight;
                });
            }
        }
        return bestWeight > 0 ? { weight: bestWeight } : null;
    }, [workoutData, dateKey]);

    /**
     * Initializes a new workout log for the selected date based on the active plan.
     * For custom/empty routines, starts with empty exercises (no fallback to defaults).
     */
    const initializeDailyLog = (overridePlanId = null, templateOverride = null) => {
        if (isHoliday) return; // STRICT BLOCK: Cannot start workout on holiday

        const planIdToUse = overridePlanId || activePlanId;

        // Use templateOverride if provided (fixes race condition when starting immediately after save)
        // Otherwise look up in savedPlans/availablePlans
        let template = templateOverride;

        if (!template) {
            // First check custom/saved plans, then default plans
            template = savedPlans.find(p => p.id === planIdToUse) || availablePlans.find(p => p.id === planIdToUse);
        }

        // If no template found and planIdToUse starts with 'custom_', it's a new empty routine
        // In this case, create an empty workout (no fallback to defaults!)
        const isCustomRoutine = planIdToUse?.startsWith('custom_');

        if (!template) {
            if (isCustomRoutine) {
                // This is a "Build from Scratch" empty routine - start with NO exercises
                template = {
                    id: planIdToUse,
                    name: 'New Routine',
                    exercises: [] // Empty! User will add exercises manually
                };
            } else {
                // Only fallback to default if it's NOT a custom routine
                template = availablePlans[0];
            }
        }

        const parseTargetReps = (repsStr) => {
            if (!repsStr) return 8; // Default
            if (typeof repsStr === 'number') return repsStr;
            const lower = repsStr.toLowerCase();
            if (lower.includes('failure')) return 15;
            if (lower.includes('sec') || lower.includes('min')) return 1; // Time based, treated differently or handled by cardio logic
            if (repsStr.includes('-')) {
                const parts = repsStr.split('-').map(s => parseInt(s.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    return Math.max(parts[0], parts[1]); // Use Max of range for target calculation
                }
            }
            const parsed = parseInt(repsStr);
            return isNaN(parsed) ? 8 : parsed;
        };

        const newLog = {
            id: dateKey,
            templateName: template.name,
            exercises: template.exercises.map(ex => ({
                ...ex,
                numericalTargetReps: parseTargetReps(ex.targetReps),
                sets: Array(ex.targetSets).fill(0).map(() => ({
                    weight: '', reps: '', completed: false,
                    distance: '', time: '', pace: '', duration: '', holdTime: ''
                })),
                supersetId: null,
                cardioMode: ex.defaultMode || 'distance',
                coreMode: 'reps',
                isLocked: false,
            })),
            isLocked: false,
            startTime: null,
            endTime: null
        };
        setWorkoutData(prev => ({ ...prev, [dateKey]: newLog }));
    };

    /**
     * Updates a specific field of a set (e.g., weight, reps, completed).
     */
    const updateSet = (exIndex, setIndex, field, value) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            // Bulletproof Guard: Check expiration inside setter
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev; // Check exercise lock

            // Auto-start timer logic: First completed set of ANY exercise starts the timer
            if (field === 'completed' && value === true && !day.startTime) {
                day.startTime = Date.now();
            }

            day.exercises = day.exercises.map((ex, i) => {
                if (i !== exIndex) return ex;
                const newSets = [...ex.sets];
                newSets[setIndex] = { ...newSets[setIndex], [field]: value };
                return { ...ex, sets: newSets };
            });
            return { ...prev, [dateKey]: day };
        });
    };

    /**
     * Toggles cardio tracking mode between 'distance' (km/min) and 'circuit' (reps/time).
     * RESETS state to avoid data leakage between modes.
     */
    const updateCardioMode = (exIndex, mode) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev;

            day.exercises = day.exercises.map((ex, i) => {
                if (i !== exIndex) return ex;
                if (ex.cardioMode === mode) return ex; // Guard: No-op if same mode

                // 1. Snapshot current sets into the "Backpack" (storedSets)
                const currentMode = ex.cardioMode || 'distance'; // default fallback
                const prevStored = ex.storedSets || {};

                const updatedStored = {
                    ...prevStored,
                    [currentMode]: ex.sets // Save active sets to backpack
                };

                // 2. Prepare new sets: Load from backpack OR generate fresh
                let newSets = [];
                if (updatedStored[mode] && updatedStored[mode].length > 0) {
                    newSets = updatedStored[mode]; // Restore previous session
                } else {
                    // Generate fresh if visiting this mode for first time
                    const defaultSetCount = ex.targetSets || 3;
                    newSets = Array(defaultSetCount).fill(0).map(() => ({
                        weight: '', reps: '', completed: false,
                        distance: '', time: '', pace: '', duration: '', holdTime: ''
                    }));
                }

                return {
                    ...ex,
                    cardioMode: mode,
                    sets: newSets,
                    storedSets: updatedStored // Commit the backpack
                };
            });
            return { ...prev, [dateKey]: day };
        });
    };

    /**
     * Toggles core tracking mode between 'reps' and 'hold' (time).
     */
    const updateCoreMode = (exIndex, mode) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev;
            day.exercises = day.exercises.map((ex, i) =>
                i === exIndex ? { ...ex, coreMode: mode } : ex
            );
            return { ...prev, [dateKey]: day };
        });
    };

    const [lastDeletedSet, setLastDeletedSet] = useState(null);

    // Auto-clear undo history after 5 seconds
    useEffect(() => {
        if (lastDeletedSet) {
            const timer = setTimeout(() => {
                setLastDeletedSet(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastDeletedSet]);

    const addSet = (exIndex) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev;

            day.exercises = day.exercises.map((ex, i) => {
                if (i === exIndex) {
                    // Smart Defaults: Auto-fill from previous set
                    let newSet = { weight: '', reps: '', completed: false };

                    if (ex.sets.length > 0) {
                        const lastSet = ex.sets[ex.sets.length - 1];
                        // Copy defined values from last set
                        newSet = {
                            ...newSet,
                            weight: lastSet.weight || '',
                            reps: lastSet.reps || '',
                            distance: lastSet.distance || '',
                            time: lastSet.time || '',
                            duration: lastSet.duration || '',
                            holdTime: lastSet.holdTime || '',
                            target: lastSet.target // Optional: copy target if user adjusted it
                        };
                    }
                    return { ...ex, sets: [...ex.sets, newSet] };
                }
                return ex;
            });
            return { ...prev, [dateKey]: day };
        });
    };

    const removeSet = (exIndex, setIndex) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev;

            // Capture set to be deleted for Undo
            const setToRemove = day.exercises[exIndex].sets[setIndex];
            setLastDeletedSet({
                exerciseIndex: exIndex,
                setIndex: setIndex,
                set: setToRemove
            });

            day.exercises = day.exercises.map((ex, i) => {
                if (i !== exIndex) return ex;
                const newSets = ex.sets.filter((_, si) => si !== setIndex);
                return { ...ex, sets: newSets };
            });
            return { ...prev, [dateKey]: day };
        });
    };

    const undoDelete = () => {
        if (!lastDeletedSet) return;

        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            // Safety checks
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;

            const { exerciseIndex, setIndex, set } = lastDeletedSet;

            day.exercises = day.exercises.map((ex, i) => {
                if (i !== exerciseIndex) return ex;
                // Insert back at original position
                const newSets = [...ex.sets];
                newSets.splice(setIndex, 0, set);
                return { ...ex, sets: newSets };
            });
            return { ...prev, [dateKey]: day };
        });
        setLastDeletedSet(null);
    };

    const addExercise = (type) => {
        if (isLocked) return;
        const newEx = {
            name: type === 'strength' ? "New Exercise" : type === 'cardio' ? "Cardio Activity" : "Core Exercise",
            targetSets: 3,
            targetReps: "", // Explicitly empty to force user input
            type: type === 'strength' ? undefined : type,
            sets: Array(3).fill(0).map(() => ({ weight: '', reps: '', completed: false })),
            supersetId: null, cardioMode: 'distance', coreMode: 'reps'
        };
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            day.exercises = [...day.exercises, newEx];
            return { ...prev, [dateKey]: day };
        });
    };

    const removeExercise = (exIndex) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev;
            day.exercises = day.exercises.filter((_, i) => i !== exIndex);
            return { ...prev, [dateKey]: day };
        });
    };

    const updateExerciseName = (exIndex, val) => {
        if (isLocked) return;
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;
            if (day.exercises[exIndex].isLocked) return prev;
            day.exercises = day.exercises.map((ex, i) =>
                i === exIndex ? { ...ex, name: val } : ex
            );
            return { ...prev, [dateKey]: day };
        });
    };

    /**
     * Handling Superset creation/deletion.
     * Logic: If nothing pending, start link or unlink. If pending, complete link.
     */
    const handleLinkAction = (index) => {
        if (isLocked) return;
        if (pendingSuperset === null) {
            const ex = currentLog.exercises[index];
            if (ex.supersetId) {
                // Unlink
                setWorkoutData(prev => {
                    const day = { ...prev[dateKey] };
                    const expired = day.endTime && (Date.now() - day.endTime > 86400000);
                    if (day.isLocked || expired) return prev;

                    const linkedId = day.exercises[index].supersetId;
                    day.exercises = day.exercises.map(e =>
                        e.supersetId === linkedId ? { ...e, supersetId: null } : e
                    );
                    return { ...prev, [dateKey]: day };
                });
            } else {
                setPendingSuperset(index);
            }
        } else {
            if (pendingSuperset === index) { setPendingSuperset(null); return; }
            // Link
            const newId = Date.now();
            setWorkoutData(prev => {
                const day = { ...prev[dateKey] };
                const expired = day.endTime && (Date.now() - day.endTime > 86400000);
                if (day.isLocked || expired) return prev;

                day.exercises = day.exercises.map((ex, i) => {
                    if (i === pendingSuperset || i === index) return { ...ex, supersetId: newId };
                    return ex;
                });
                return { ...prev, [dateKey]: day };
            });
            setPendingSuperset(null);
        }
    };

    const saveCustomRoutine = (newPlan) => {
        setSavedPlans(prev => [...prev, newPlan]);
        setActivePlanId(newPlan.id);
    };

    const toggleLock = () => {
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            // Bulletproof: Cannot toggle lock if expired (permanently locked)
            if (expired) return prev;

            const isLocking = !day.isLocked;

            // Lock/Unlock
            day.isLocked = isLocking;
            return { ...prev, [dateKey]: day };
        });
    };

    const toggleExerciseLock = (exIndex) => {
        if (isLocked) return; // Cannot unlock exercise if global workout is locked
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;

            day.exercises = day.exercises.map((ex, i) =>
                i === exIndex ? { ...ex, isLocked: !ex.isLocked } : ex
            );
            return { ...prev, [dateKey]: day };
        });
    };

    const deleteRoutine = (planId) => {
        const updated = savedPlans.filter(p => p.id !== planId);
        setSavedPlans(updated);
        setActivePlanId(availablePlans[0].id);
    }

    const discardWorkout = () => {
        setWorkoutData(prev => {
            const day = prev[dateKey];
            if (!day) return prev;

            // Bulletproof constraint: Cannot discard if Locked or Expired
            // We allow discard if user explicitly UNLOCKED it (and not expired)
            const expired = day.endTime && (Date.now() - day.endTime > 86400000);
            if (day.isLocked || expired) return prev;

            const copy = { ...prev };
            delete copy[dateKey];
            return copy;
        });
    }

    const finishSession = (timestamp) => {
        setWorkoutData(prev => {
            const day = { ...prev[dateKey] };
            if (day.endTime) return prev; // Already finished
            day.endTime = timestamp;
            return { ...prev, [dateKey]: day };
        });
    };

    return {
        workoutData,
        savedPlans,
        activePlanId,
        setActivePlanId,
        userProfile,
        setUserProfile,
        availablePlans,
        currentLog,
        isLocked,
        isHoliday, // Exporting this
        pendingSuperset,
        initializeDailyLog,
        updateSet,
        updateCardioMode,
        updateCoreMode,
        addSet,
        removeSet,
        addExercise,
        removeExercise,
        updateExerciseName,
        toggleExerciseLock,
        handleLinkAction,
        saveCustomRoutine,
        toggleLock,
        deleteRoutine,
        discardWorkout,
        finishSession,
        getPreviousBest,
        lastDeletedSet,
        undoDelete
    };
};
