import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-zinc-100 text-zinc-900 hover:bg-white',
        secondary: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
        danger: 'bg-red-900/20 text-red-500 hover:bg-red-900/30',
        ghost: 'text-zinc-400 hover:text-zinc-100',
        superset: 'bg-orange-500/10 text-orange-500 border border-orange-500/50 hover:bg-orange-500/20',
        strength: 'bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20',
        cardio: 'bg-pink-500/10 text-pink-500 border border-pink-500/30 hover:bg-pink-500/20',
        abs: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
    };
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
