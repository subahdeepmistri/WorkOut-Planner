import React from 'react';
import clsx from 'clsx';

export const Button = ({ children, onClick, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-neon-green text-black hover:bg-green-400 shadow-[0_0_10px_rgba(57,255,20,0.3)]',
        secondary: 'bg-dark-input text-white hover:bg-gray-700 border border-gray-700',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20',
        ghost: 'bg-transparent text-gray-400 hover:text-white',
        neon: 'bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10 shadow-[0_0_5px_rgba(57,255,20,0.2)]'
    };

    return (
        <button
            onClick={onClick}
            className={clsx(
                'px-4 py-2 rounded-lg font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const IconButton = ({ icon: Icon, onClick, color = 'text-gray-400', hoverColor = 'hover:text-white', size = 20, className }) => (
    <button
        onClick={onClick}
        className={clsx('p-2 rounded-full hover:bg-white/5 transition-colors', color, hoverColor, className)}
    >
        <Icon size={size} />
    </button>
);
