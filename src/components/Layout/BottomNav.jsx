import React from 'react';
import { Icons } from '../../lib/icons';

export const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16">
                <NavItem icon={Icons.Dumbbell} label="Workout" active />
                <NavItem icon={Icons.Calendar} label="Calendar" />
                <NavItem icon={Icons.Chart} label="Stats" />
            </div>
        </nav>
    );
};

const NavItem = ({ icon: Icon, label, active }) => (
    <button className="flex flex-col items-center gap-1 w-full h-full justify-center">
        <Icon size={20} className={active ? 'text-neon-green neon-shadow' : 'text-gray-500'} />
        <span className={active ? 'text-[10px] text-neon-green font-bold' : 'text-[10px] text-gray-500'}>{label}</span>
    </button>
);
