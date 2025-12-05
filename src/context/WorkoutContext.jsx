import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { WorkoutRepository } from '../lib/repository';

const WorkoutContext = createContext();

const workoutReducer = (state, action) => {
    const { logs, selectedDate } = state;
    const dateKey = selectedDate.toISOString().split('T')[0];

    const updateLogs = (newDayLog) => ({
        ...state,
        logs: { ...logs, [dateKey]: newDayLog }
    });

    switch (action.type) {
        case 'INIT_DATA':
            return { ...state, logs: action.payload.logs, templates: action.payload.templates, workoutStatuses: action.payload.statuses };
        case 'SET_DATE':
            return { ...state, selectedDate: action.payload };
        case 'UPDATE_LOGS':
            return updateLogs(action.payload);
        case 'UPDATE_TEMPLATES':
            return { ...state, templates: action.payload };
        case 'UPDATE_STATUSES':
            return { ...state, workoutStatuses: action.payload };
        default:
            return state;
    }
};

export const WorkoutProvider = ({ children }) => {
    const [state, dispatch] = useReducer(workoutReducer, {
        selectedDate: new Date(),
        logs: {},
        templates: [],
        workoutStatuses: {},
    });

    // Initial Load
    useEffect(() => {
        const logs = WorkoutRepository.getLogs();
        const templates = WorkoutRepository.getTemplates();
        const statuses = WorkoutRepository.getWorkoutStatuses();
        dispatch({ type: 'INIT_DATA', payload: { logs, templates, statuses } });
    }, []);

    // Persistence
    useEffect(() => {
        if (Object.keys(state.logs).length > 0) WorkoutRepository.saveLogs(state.logs);
    }, [state.logs]);

    useEffect(() => {
        WorkoutRepository.saveTemplates(state.templates);
    }, [state.templates]);

    useEffect(() => {
        if (Object.keys(state.workoutStatuses).length > 0) WorkoutRepository.saveWorkoutStatuses(state.workoutStatuses);
    }, [state.workoutStatuses]);

    // Actions
    const actions = {
        setDate: (date) => dispatch({ type: 'SET_DATE', payload: date }),
        updateLogs: (logs) => dispatch({ type: 'UPDATE_LOGS', payload: logs }),
        addTemplate: (template) => dispatch({ type: 'UPDATE_TEMPLATES', payload: [...state.templates, template] }),
        deleteTemplate: (id) => dispatch({ type: 'UPDATE_TEMPLATES', payload: state.templates.filter(t => t.id !== id) }),
        toggleLock: () => {
            const dateKey = state.selectedDate.toISOString().split('T')[0];
            const currentStatus = state.workoutStatuses[dateKey];
            const newStatus = currentStatus === 'locked' ? 'editing' : 'locked';
            dispatch({ type: 'UPDATE_STATUSES', payload: { ...state.workoutStatuses, [dateKey]: newStatus } });
        }
    };

    return (
        <WorkoutContext.Provider value={{ state, actions }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => useContext(WorkoutContext);
