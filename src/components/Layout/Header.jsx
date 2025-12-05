import React from 'react';
import { Icons } from '../../lib/icons';
import { IconButton } from '../Shared/Button';
import { useWorkout } from '../../context/WorkoutContext';

export const Header = () => {
    const { state, actions } = useWorkout();
    const { selectedDate } = state;

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        actions.setDate(newDate);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/5 pb-safe">
            <div className="flex flex-col items-center py-2">
                <div className="text-neon-purple font-black tracking-widest text-xl neon-text">SPIDEYLIFT</div>
                <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Web-Slinging Strength</div>
            </div>

            <div className="flex justify-between items-center px-4 pb-2">
                <IconButton icon={Icons.ChevronLeft} onClick={() => changeDate(-1)} className="text-neon-green" />
                <div className="text-center">
                    <div className="text-[10px] text-neon-blue uppercase tracking-wider font-bold">Today's Workout</div>
                    <div className="text-white font-mono font-bold text-lg">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                </div>
                <IconButton icon={Icons.ChevronRight} onClick={() => changeDate(1)} className="text-neon-green" />
            </div>
        </header>
    );
};
