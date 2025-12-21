import React from 'react';

export const DualMetricCard = ({ title, left, right, icon: Icon, theme }) => {
    // left/right: { value, unit, label, subtext }

    // Check if empty
    const leftEmpty = !left || !left.value || left.value === 0 || left.value === '0:00';
    const rightEmpty = !right || !right.value || right.value === 0 || right.value === '0:00';

    if (leftEmpty && rightEmpty) {
        // Render Empty State
        return (
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-60">
                <div className="flex items-center gap-2 mb-4">
                    {Icon && <Icon className="w-4 h-4 text-zinc-400" />}
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</span>
                </div>
                <div className="text-sm font-medium text-zinc-400 italic">No data today</div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 z-10">
                {Icon && <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{title}</span>
            </div>

            {/* Split Grid */}
            <div className="flex w-full divide-x divide-zinc-100 dark:divide-zinc-800 z-10">
                {/* Left Col */}
                <div className={`flex-1 pr-4 ${leftEmpty ? 'opacity-30 blur-[1px]' : ''}`}>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{left.label}</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-zinc-800 dark:text-white tracking-tight">{left.value}</span>
                        <span className="text-xs font-bold text-zinc-500">{left.unit}</span>
                    </div>
                    {left.subtext && <div className="text-xs font-medium text-zinc-400 mt-1">{left.subtext}</div>}
                </div>

                {/* Right Col */}
                <div className={`flex-1 pl-4 ${rightEmpty ? 'opacity-30 blur-[1px]' : ''}`}>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{right.label}</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-zinc-800 dark:text-white tracking-tight">{right.value}</span>
                        <span className="text-xs font-bold text-zinc-500">{right.unit}</span>
                    </div>
                    {right.subtext && <div className="text-xs font-medium text-zinc-400 mt-1">{right.subtext}</div>}
                </div>
            </div>

            {/* Texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100/50 dark:bg-zinc-800/20 rounded-bl-full pointer-events-none"></div>
        </div>
    );
};
